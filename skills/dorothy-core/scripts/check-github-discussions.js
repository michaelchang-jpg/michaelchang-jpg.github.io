const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = "michaelchang-jpg/michaelchang-jpg.github.io";
const STATE_FILE = path.join(__dirname, '../memory/github-discussions-state.json');

// GraphQL Query to get latest discussion comments
const query = `
query {
  repository(owner: "michaelchang-jpg", name: "michaelchang-jpg.github.io") {
    discussions(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        id
        title
        url
        comments(last: 20) {
          nodes {
            id
            author { login }
            body
            createdAt
            url
            replies(first: 10) {
              nodes {
                author { login }
                body
              }
            }
          }
        }
      }
    }
  }
}
`;

function getNewComments() {
    try {
        // Execute gh api graphql using a temporary file for the query to avoid shell escaping issues
        const queryPath = path.join(__dirname, 'temp_query.graphql');
        fs.writeFileSync(queryPath, query);
        const output = execSync(`gh api graphql -F query=@"${queryPath}"`, { encoding: 'utf8' });
        fs.unlinkSync(queryPath);
        const data = JSON.parse(output);
        const discussions = data.data.repository.discussions.nodes;

        // Load state
        let state = { seenCommentIds: [] };
        if (fs.existsSync(STATE_FILE)) {
            state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        }

        const newComments = [];

        discussions.forEach(disc => {
            // 檢查整個 Discussion 裡是否已經有 Dorothy 或 Michael 的足跡
            const allComments = disc.comments.nodes;
            const hasExistingDorothyFootprint = allComments.some(c => {
                const author = c.author ? c.author.login : "ghost";
                return author === "michaelchang-jpg" || c.body.includes("[Dorothy]");
            }) || allComments.some(c => 
                c.replies.nodes.some(r => (r.author && r.author.login === "michaelchang-jpg") || r.body.includes("[Dorothy]"))
            );

            if (hasExistingDorothyFootprint) return;

            disc.comments.nodes.forEach(comment => {
                const commentId = comment.id;
                const author = comment.author ? comment.author.login : "ghost";
                
                // 排除作者本人
                if (author === "michaelchang-jpg") return;
                
                // 檢查是否是新留言
                if (!state.seenCommentIds.includes(commentId)) {
                    newComments.push({
                        discussionTitle: disc.title,
                        discussionId: disc.id,
                        author: author,
                        body: comment.body,
                        createdAt: comment.createdAt,
                        id: commentId,
                        url: comment.url
                    });
                }
            });
        });

        if (newComments.length > 0) {
            // 更新已讀列表
            state.seenCommentIds = [...new Set([...state.seenCommentIds, ...newComments.map(c => c.id)])].slice(-200);
            fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
            console.log(JSON.stringify(newComments, null, 2));
        } else {
            console.log("No new comments.");
        }

    } catch (error) {
        console.error("Error checking discussions:", error.message);
        process.exit(1);
    }
}

getNewComments();

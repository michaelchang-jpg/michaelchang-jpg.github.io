const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const discussionId = process.argv[2];
const replyToId = process.argv[3];
const body = process.argv[4];

if (!discussionId || !body) {
    console.error("Usage: node reply-github-discussion.js <discussionId> <replyToId|null> <body>");
    process.exit(1);
}

const query = `
mutation {
  addDiscussionComment(input: {discussionId: "${discussionId}", replyToId: ${replyToId && replyToId !== 'null' ? `"${replyToId}"` : 'null'}, body: "${body.replace(/"/g, '\\"')}"}) {
    comment {
      id
      url
    }
  }
}
`;

try {
    const queryPath = path.join(__dirname, 'temp_reply.graphql');
    fs.writeFileSync(queryPath, query);
    const output = execSync(`gh api graphql -F query=@"${queryPath}"`, { encoding: 'utf8' });
    fs.unlinkSync(queryPath);
    console.log(output);
} catch (error) {
    console.error("Error replying to discussion:", error.message);
    process.exit(1);
}

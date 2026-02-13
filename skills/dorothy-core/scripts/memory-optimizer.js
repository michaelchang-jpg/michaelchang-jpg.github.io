const fs = require('fs');

/**
 * Dorothy's Memory Optimizer v1.0
 * Cleans and refines raw vector search results to save tokens and improve focus.
 */

function optimize(rawResults) {
    if (!rawResults || !rawResults.results || rawResults.results.length === 0) {
        return "No relevant memories found.";
    }

    const results = rawResults.results;
    
    // 1. Group by file path to handle fragmented snippets
    const grouped = {};
    results.forEach(res => {
        if (!grouped[res.path]) grouped[res.path] = [];
        grouped[res.path].push(res);
    });

    let optimizedOutput = "### 🧠 Optimized Memory Retrieval\n\n";

    for (const [path, snippets] of Object.entries(grouped)) {
        optimizedOutput += `**Source: ${path}**\n`;
        
        // 2. Deduplicate and clean snippets
        // Simple heuristic: if a snippet is contained within another, skip it.
        // Sort by length descending
        snippets.sort((a, b) => b.snippet.length - a.snippet.length);
        
        const uniqueSnippets = [];
        snippets.forEach(s => {
            const isSubset = uniqueSnippets.some(u => u.includes(s.snippet.trim()));
            if (!isSubset) {
                uniqueSnippets.push(s.snippet.trim());
            }
        });

        // 3. Filter out common noise patterns
        const cleanedSnippets = uniqueSnippets.map(text => {
            return text
                .split('\n')
                .filter(line => {
                    // Filter out system noise
                    const isSystemNoise = /Gateway status|Tokens:|sessionId|sessionKey|lastStatus/.test(line);
                    // Filter out repetitive headers if they aren't content-rich
                    const isRepetitiveHeader = line.startsWith('#') && line.length < 15 && uniqueSnippets.length > 1;
                    return !isSystemNoise && !isRepetitiveHeader;
                })
                .join('\n');
        }).filter(s => s.length > 10);

        optimizedOutput += cleanedSnippets.join('\n---\n') + "\n\n";
    }

    return optimizedOutput;
}

// CLI usage for Dorothy to call via exec
try {
    const inputPath = process.argv[2];
    if (!inputPath) {
        console.error("Usage: node memory-optimizer.js <path_to_raw_results_json>");
        process.exit(1);
    }
    const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    process.stdout.write(optimize(rawData));
} catch (e) {
    process.stderr.write("Optimization Error: " + e.message);
}

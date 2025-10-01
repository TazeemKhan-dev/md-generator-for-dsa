export function generateMarkdown({
  title,
  qNumber = 0,
  problemUnderstanding,
  inputOutput,
  constraints,
  examples,
  approaches,
  justification,
  variants,
}) {
  let md = "";

  // Title with Q number, centered and bold
    if (title) {
      // Split title at the first "-"
      const index = title.indexOf("-");
      let qNumber = "";
      let remainingTitle = title;

      if (index !== -1) {
        qNumber = title.slice(0, index).trim(); // part before "-"
        remainingTitle = title.slice(index + 1).trim(); // part after "-"
      }

      md += `<br>\n<h1 style="text-align:center; font-size:2.5em; font-weight:bold;">Q${qNumber}: ${remainingTitle}</h1>\n<br>\n---\n\n`;
    }
  // Problem Understanding
  if (problemUnderstanding && Object.keys(problemUnderstanding).length) {
    md += "## 1. Understand the Problem\n";
    if (problemUnderstanding.readIdentify)
      md += `- **Read & Identify:** ${problemUnderstanding.readIdentify}\n`;
    if (problemUnderstanding.goal)
      md += `- **Goal:** ${problemUnderstanding.goal}\n`;
    if (problemUnderstanding.paraphrase)
      md += `- **Paraphrase:** ${problemUnderstanding.paraphrase}\n`;
    md += "\n---\n\n";
  }

  // Input & Output
  if (inputOutput && (inputOutput.input || inputOutput.output)) {
    md += "## 2. Input, Output, & Constraints\n";
    if (inputOutput.input)
      md += `- **Input:**\n\`\`\`text\n${inputOutput.input}\n\`\`\`\n`;
    if (inputOutput.output)
      md += `- **Output:**\n\`\`\`text\n${inputOutput.output}\n\`\`\`\n`;
    // Constraints
    if (constraints && constraints.length) {
      md += "**Constraints:**\n";
      constraints.forEach((c) => {
        if (c.trim() === "") return;
        const lines = c.split("\n");
        lines.forEach((line) => {
          md += `- ${line}\n`;
        });
      });
      md += "\n";
    }
    md += "\n---\n\n";
  }

  // Examples
  if (examples && examples.length) {
    md += "## 3. Examples & Edge Cases\n";
    examples.forEach((ex, i) => {
      if (ex.input || ex.output) {
        md += `**Example ${i + 1} (${ex.type || "Normal Case"}):**\n`;
        if (ex.input) md += `Input:\n\`\`\`text\n${ex.input}\n\`\`\`\n`;
        if (ex.output) md += `Output:\n\`\`\`text\n${ex.output}\n\`\`\`\n\n`;
      }
    });
    md += "\n---\n\n";
  }

  // Approaches
  if (approaches && approaches.length) {
    md += "## 4. Approaches\n";
    approaches.forEach((app, i) => {
      if (app.name) md += `### Approach ${i + 1}: ${app.name}\n`;
      if (app.idea) md += `**Idea:** ${app.idea}\n`;
      if (app.showPseudocode && app.pseudocode)
        md += `**Pseudocode:**\n\`\`\`text\n${app.pseudocode}\n\`\`\`\n`;
      if (app.showJava && app.javaCode)
        md += `**Java Code:**\n\`\`\`java\n${app.javaCode}\n\`\`\`\n`;
      if (app.timeComplexity)
        md += `**Time Complexity:** ${app.timeComplexity}\n`;
      if (app.spaceComplexity)
        md += `**Space Complexity:** ${app.spaceComplexity}\n`;
      md += "\n";
    });
    md += "\n---\n\n";
  }

  // Justification
  if (justification && justification.length) {
    md += "## 5. Justification / Proof of Optimality\n";
    justification.forEach((j, i) => {
      if (j.trim()) md += `- ${j}\n`;
    });
    md += "\n---\n\n";
  }

  // Variants
  if (variants && variants.length) {
    md += "## 6. Variants / Follow-Ups\n";
    variants.forEach((v) => {
      if (v.trim()) md += `- ${v}\n`;
    });
    md += "\n---\n\n";
  }

  return md;
}

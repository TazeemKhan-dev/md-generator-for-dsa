export function generateMarkdown({
  title,
  problemUnderstanding,
  inputOutput,
  constraints,
  examples,
  approaches,
  justification,
  variants,
  edgeCases,
}) {
  let md = "";
  let sectionNumber = 1; // dynamic numbering

  // Title
  if (title) {
    const index = title.indexOf("-");
    let qNumber = "";
    let remainingTitle = title;

    if (index !== -1) {
      qNumber = title.slice(0, index).trim();
      remainingTitle = title.slice(index + 1).trim();
    }

    md += `\n<h1 style="text-align:center; font-size:2.5em; font-weight:bold;">Q${qNumber}: ${remainingTitle}</h1>\n\n`;
  }

  // Problem Understanding
  if (problemUnderstanding && Object.values(problemUnderstanding).some(v => v.trim() !== "")) {
    md += `## ${sectionNumber++}. Understand the Problem\n`;
    if (problemUnderstanding.readIdentify?.trim())
      md += `- **Read & Identify:** ${problemUnderstanding.readIdentify.trim()}\n`;
    if (problemUnderstanding.goal?.trim())
      md += `- **Goal:** ${problemUnderstanding.goal.trim()}\n`;
    if (problemUnderstanding.paraphrase?.trim())
      md += `- **Paraphrase:** ${problemUnderstanding.paraphrase.trim()}\n`;
    md += "\n---\n\n";
  }

  // Input & Output
  if ((inputOutput?.input?.trim()) || (inputOutput?.output?.trim()) || (constraints && constraints.length)) {
    md += `## ${sectionNumber++}. Input, Output, & Constraints\n\n`;
    if (inputOutput?.input?.trim())
      md += `- **Input:**\n\`\`\`text\n${inputOutput.input.trim()}\n\`\`\`\n\n`;
    if (inputOutput?.output?.trim())
      md += `- **Output:**\n\`\`\`text\n${inputOutput.output.trim()}\n\`\`\`\n\n`;

    if (constraints && constraints.length) {
      const filteredConstraints = constraints.filter(c => c.trim() !== "");
      if (filteredConstraints.length) {
        md += "**Constraints:**\n";
        filteredConstraints.forEach(c => {
          c.split("\n").forEach(line => {
            if (line.trim()) md += `- ${line.trim()}\n`;
          });
        });
        md += "\n";
      }
    }
  }

  // Examples
  if (examples && examples.length) {
    const filteredExamples = examples.filter(ex => ex.input.trim() || ex.output.trim());
    if (filteredExamples.length) {
      md += `## ${sectionNumber++}. Examples\n\n`;
      filteredExamples.forEach((ex, i) => {
        md += `**Example ${i + 1} (${ex.type || "Normal Case"}):**\n`;
        if (ex.input.trim()) md += `Input:\n\`\`\`text\n${ex.input.trim()}\n\`\`\`\n`;
        if (ex.output.trim()) md += `Output:\n\`\`\`text\n${ex.output.trim()}\n\`\`\`\n\n`;
      });
    }
  }

  // Edge Cases
  if (edgeCases && edgeCases.length) {
    const filteredEdgeCases = edgeCases.filter(ec => ec.trim() !== "");
    if (filteredEdgeCases.length) {
      md += `## ${sectionNumber++}. Edge Case Checklist\n\n`;
      filteredEdgeCases.forEach(ec => {
        ec.split("\n").forEach(line => {
          if (line.trim()) md += `- ${line.trim()}\n`;
        });
      });
      md += "\n";
    }
  }

  // Approaches
  if (approaches && approaches.length) {
    const filteredApproaches = approaches.filter(app => app.name.trim() || app.idea.trim());
    if (filteredApproaches.length) {
      md += `## ${sectionNumber++}. Approaches\n\n`;
      filteredApproaches.forEach((app, i) => {
        if (app.name.trim()) md += `### Approach ${i + 1}: ${app.name.trim()}\n\n`;

        if (app.idea.trim()) {
          md += `- **Idea:**\n`;
          app.idea.trim().split("\n").forEach(line => {
            if (line.trim()) md += `  - ${line.trim()}\n`;
          });
          md += "\n";
        }

        if (app.showPseudocode && app.pseudocode.trim()) {
          md += `**Pseudocode:**\n\`\`\`text\n${app.pseudocode.trim()}\n\`\`\`\n\n`;
        }

        if (app.showJava && app.javaCode.trim()) {
          md += `**Java Code:**\n\`\`\`java\n${app.javaCode.trim()}\n\`\`\`\n\n`;
        }

        if (app.timeComplexity?.trim() || app.spaceComplexity?.trim()) {
          md += `**Complexity:**\n`;
          if (app.timeComplexity?.trim()) md += `- Time: ${app.timeComplexity.trim()}\n`;
          if (app.spaceComplexity?.trim()) md += `- Space: ${app.spaceComplexity.trim()}\n`;
          md += "\n";
        }
      });
    }
  }

  // Justification
  if (justification && justification.length) {
    const filteredJust = justification.filter(j => j.trim() !== "");
    if (filteredJust.length) {
      md += `## ${sectionNumber++}. Justification / Proof of Optimality\n\n`;
      filteredJust.forEach(j => {
        j.split("\n").forEach(line => {
          if (line.trim()) md += `- ${line.trim()}\n`;
        });
      });
      md += "\n";
    }
  }

  // Variants
  if (variants && variants.length) {
    const filteredVariants = variants.filter(v => v.trim() !== "");
    if (filteredVariants.length) {
      md += `## ${sectionNumber++}. Variants / Follow-Ups\n\n`;
      filteredVariants.forEach(v => {
        v.split("\n").forEach(line => {
          if (line.trim()) md += `- ${line.trim()}\n`;
        });
      });
      md += "\n";
    }
  }

  return md;
}

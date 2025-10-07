export function generateMarkdown({
  title,
  problemUnderstanding,
  algorithm,
  constraints,
  edgeCases,
  examples,
  approaches,
  justification,
  variants,
  tips,
  showSections,
}) {
  let md = "";
  let sectionNumber = 1;

  // --- Utility: Render description + subsections ---
  const renderSectionContent = (content, subsections = []) => {
    let sectionMd = "";

    // 1. Main description
    const lines = content.trim() ? content.split("\n") : [];
    lines.forEach((line) => {
      if (line.trim()) {
        const currentIndent = line.match(/^\s*/)[0];
        const bulletChar = currentIndent.length > 0 ? "*" : "-";
        sectionMd += `${currentIndent}${bulletChar} ${line.trim()}\n`;
      }
    });

    // 2. Subsections (render only if added by user)
    subsections.forEach((sub) => {
      if (sub.heading.trim() || sub.content.trim()) {
        if (sub.heading.trim()) {
          sectionMd += `\n- **${sub.heading.trim()}**\n`; 
        }
        if (sub.content.trim()) {
          const subLines = sub.content.split("\n");
          subLines.forEach((line) => {
            if (line.trim()) {
              const currentIndent = line.match(/^\s*/)[0];
              const bulletChar = currentIndent.length > 0 ? "*" : "-";
              sectionMd += `    ${currentIndent}${bulletChar} ${line.trim()}\n`;
            }
          });
        }
      }
    });

    return sectionMd.trimEnd() + "\n";
  };

  // --- Title Section ---
  let regionName = title || "Problem";
  md += `<!-- #region ${regionName} -->\n\n`;

  if (title) {
    const index = title.indexOf("-");
    let qNumber = "";
    let remainingTitle = title;

    if (index !== -1) {
      qNumber = title.slice(0, index).trim();
      remainingTitle = title.slice(index + 1).trim();
    }

    md += `<h1 style="text-align:center; font-size:2.5em; font-weight:bold;">Q${qNumber}: ${remainingTitle}</h1>\n\n`;
  }

  // --- Sections Configuration ---
  const sectionsConfig = [
    { key: "problemUnderstanding", label: "Problem Understanding", data: problemUnderstanding },
    { key: "algorithm", label: "Algorithm", data: algorithm },
    { key: "constraints", label: "Constraints", data: constraints },
    { key: "edgeCases", label: "Edge Cases", data: edgeCases },
    { key: "examples", label: "Examples", data: examples },
    { key: "approaches", label: "Approaches", data: approaches },
    { key: "justification", label: "Justification / Proof of Optimality", data: justification },
    { key: "variants", label: "Variants / Follow-Ups", data: variants },
    { key: "tips", label: "Tips & Observations", data: tips },
  ];

  sectionsConfig.forEach((section) => {
    const { key, label, data } = section;
    if (!showSections[key]) return;

    let contentMd = "";

    if (["problemUnderstanding", "constraints", "edgeCases", "justification", "variants", "tips"].includes(key)) {
      contentMd = renderSectionContent(data.description || "", data.subsections || []);
    } else if (key === "algorithm" && data?.length) {
      data.forEach((algo, i) => {
        if (algo.problem.trim() || algo.idea.trim() || algo.steps.trim()) {
          contentMd += `### Algorithm ${i + 1}: ${algo.problem || "Problem"}\n\n`;
          if (algo.example.trim()) {
            contentMd += `**Example:**\n\`\`\`text\n${algo.example.trim()}\n\`\`\`\n\n`;
          }
          if (algo.idea.trim()) contentMd += `**Idea:**\n${renderSectionContent(algo.idea)}\n`;
          if (algo.steps.trim()) contentMd += `**Steps:**\n${renderSectionContent(algo.steps)}\n`;
        }
      });
    } else if (key === "examples" && data?.length) {
      data.forEach((ex, i) => {
        if (ex.input.trim() || ex.output.trim() || ex.type.trim()) {
          contentMd += `### Example ${i + 1} (${ex.type || "Normal Case"}):\n\n`;
          if (ex.input.trim()) contentMd += `- **Input:**\n\`\`\`text\n${ex.input.trim()}\n\`\`\`\n\n`;
          if (ex.output.trim()) contentMd += `- **Output:**\n\`\`\`text\n${ex.output.trim()}\n\`\`\`\n\n`;
        }
      });
    } else if (key === "approaches" && data?.length) {
      data.forEach((app, i) => {
        if (app.name.trim() || app.idea.trim() || app.steps.trim() || app.javaCode.trim() || app.complexity.trim()) {
          contentMd += `### Approach ${i + 1}: ${app.name || ""}\n\n`;
          if (app.idea.trim()) contentMd += `**Idea:**\n${renderSectionContent(app.idea)}\n`;
          if (app.steps.trim()) contentMd += `**Steps:**\n${renderSectionContent(app.steps)}\n`;
          if (app.pseudocode.trim()) contentMd += `**Pseudocode:**\n\`\`\`text\n${app.pseudocode.trim()}\n\`\`\`\n\n`;
          if (app.javaCode.trim()) contentMd += `**Java Code:**\n\`\`\`java\n${app.javaCode.trim()}\n\`\`\`\n\n`;
          if (app.complexity.trim()) {
            contentMd += `**Complexity (Time & Space):**\n${renderSectionContent(app.complexity)}\n`;
          }
        }
      });
    }

    if (contentMd.trim()) {
      md += `## ${sectionNumber++}. ${label}\n\n`;
      md += contentMd + "\n---\n\n";
    }
  });

  md += `<!-- #endregion -->\n\n`;
  return md.trimEnd() + "\n";
}

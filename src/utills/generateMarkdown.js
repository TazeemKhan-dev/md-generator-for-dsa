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

  // --- Utility: Render description + subsections (kept tight) ---
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

    // 2. Subsections
    subsections.forEach((sub) => {
      if (sub.heading.trim() || sub.content.trim()) {
        if (sub.heading.trim()) {
          // Subheading as a bolded item, separated by one newline
          sectionMd += `\n- **${sub.heading.trim()}**\n`; 
        }
        if (sub.content.trim()) {
          const subLines = sub.content.split("\n");
          subLines.forEach((line) => {
            if (line.trim()) {
              const currentIndent = line.match(/^\s*/)[0];
              const bulletChar = currentIndent.length > 0 ? "*" : "-";
              // Using 4 spaces for the indentation level
              sectionMd += `    ${currentIndent}${bulletChar} ${line.trim()}\n`;
            }
          });
        }
      }
    });

    return sectionMd.trimEnd() + "\n"; // Ends with exactly one newline
  };

  // --- Start of Document and Title (Using requested HTML style) ---

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

    // Applying the exact requested HTML structure for the title
    md += `<h1 style="text-align:center; font-size:2.5em; font-weight:bold;">Q${qNumber}: ${remainingTitle}</h1>\n\n`;
  }

  // --- Sections Configuration ---
  const sectionsConfig = [
    { key: "problemUnderstanding", label: "Problem Understanding", data: problemUnderstanding, isComplex: true },
    { key: "algorithm", label: "Algorithm", data: algorithm, isList: true },
    { key: "constraints", label: "Constraints", data: constraints, isComplex: true },
    { key: "edgeCases", label: "Edge Cases", data: edgeCases, isComplex: true },
    { key: "examples", label: "Examples", data: examples, isExamples: true },
    { key: "approaches", label: "Approaches", data: approaches, isList: true },
    { key: "justification", label: "Justification / Proof of Optimality", data: justification, isComplex: true },
    { key: "variants", label: "Variants / Follow-Ups", data: variants, isComplex: true },
    { key: "tips", label: "Tips & Observations", data: tips, isComplex: true },
  ];

  sectionsConfig.forEach((section) => {
    const { key, label, data, isComplex, isList, isExamples } = section;

    if (!showSections[key]) return; // Skip hidden sections

    let shouldRender = false;
    let contentMd = "";

    // 1. Determine if section has content
    if (isComplex && (data?.description?.trim() || data?.subsections?.length)) {
      shouldRender = true;
    } else if (isList && data?.length && data.some((item) => item.problem?.trim() || item.name?.trim() || item.idea?.trim())) {
      shouldRender = true;
    } else if (isExamples && data?.length && data.some((item) => item.input?.trim() || item.output?.trim())) {
      shouldRender = true;
    }

    if (!shouldRender) return;

    // 2. Generate content Markdown
    if (key === "problemUnderstanding" || key === "constraints" || key === "edgeCases" || key === "justification" || key === "variants" || key === "tips") {
      contentMd = renderSectionContent(data.description || "", data.subsections || []);
    } else if (key === "algorithm" && data?.length) {
      data.forEach((algo, i) => {
        if (algo.problem.trim() || algo.idea.trim() || algo.steps.trim()) {
          contentMd += `### Algorithm ${i + 1}: ${algo.problem || "Problem"}\n\n`;
          
          if (algo.example.trim()) {
            contentMd += `**Example:**\n\`\`\`text\n${algo.example.trim()}\n\`\`\`\n\n`;
          }
          if (algo.idea.trim()) {
            contentMd += `**Idea:**\n${renderSectionContent(algo.idea, [])}\n`;
          }
          if (algo.steps.trim()) {
            contentMd += `**Steps:**\n${renderSectionContent(algo.steps, [])}\n`;
          }
        }
      });
    } else if (key === "examples" && data?.length) {
      data.forEach((ex, i) => {
        if (ex.input.trim() || ex.output.trim() || ex.type.trim()) {
          contentMd += `### Example ${i + 1} (${ex.type || "Normal Case"}):\n\n`;
          
          if (ex.input.trim()) {
            contentMd += `- **Input:**\n\`\`\`text\n${ex.input.trim()}\n\`\`\`\n\n`;
          }
          if (ex.output.trim()) {
            contentMd += `- **Output:**\n\`\`\`text\n${ex.output.trim()}\n\`\`\`\n\n`;
          }
        }
      });
    } else if (key === "approaches" && data?.length) {
      data.forEach((app, i) => {
        if (app.name.trim() || app.idea.trim() || app.steps.trim() || app.javaCode.trim()) {
          contentMd += `### Approach ${i + 1}: ${app.name || ""}\n\n`;
          
          if (app.idea.trim()) {
            contentMd += `**Idea:**\n${renderSectionContent(app.idea, [])}\n`;
          }
          if (app.steps.trim()) {
            contentMd += `**Steps:**\n${renderSectionContent(app.steps, [])}\n`;
          }
          if (app.pseudocode.trim()) {
            contentMd += `**Pseudocode:**\n\`\`\`text\n${app.pseudocode.trim()}\n\`\`\`\n\n`;
          }
          if (app.javaCode.trim()) {
            contentMd += `**Java Code:**\n\`\`\`java\n${app.javaCode.trim()}\n\`\`\`\n\n`;
          }
          if (app.timeComplexity || app.spaceComplexity) {
            contentMd += `**Complexity:**\n`;
            if (app.timeComplexity) contentMd += `- Time: ${app.timeComplexity}\n`;
            if (app.spaceComplexity) contentMd += `- Space: ${app.spaceComplexity}\n`;
            contentMd += "\n"; // Blank line after complexity list
          }
        }
      });
    }
    
// --- 3. Render Header and Content ---
md += `## ${sectionNumber++}. ${label}\n\n`;

const cleanContent = contentMd.trim(); // remove leading & trailing whitespace

if (cleanContent) {
  md += cleanContent + "\n";     // add section content
  md += "\n---\n\n";             // add separator AFTER content only
}


  });

  md += `<!-- #endregion -->\n\n`;
  return md.trimEnd() + "\n"; // final cleanup
}

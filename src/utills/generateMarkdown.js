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

    // Main description
    const lines = content?.trim() ? content.split("\n") : [];
    lines.forEach((line) => {
      if (line.trim()) {
        const currentIndent = line.match(/^\s*/)[0];
        const bulletChar = currentIndent.length > 0 ? "*" : "-";
        sectionMd += `${currentIndent}${bulletChar} ${line.trim()}\n`;
      }
    });

    // Subsections
    subsections.forEach((sub) => {
      if (sub.heading?.trim() || sub.content?.trim()) {
        if (sub.heading?.trim()) sectionMd += `\n- **${sub.heading.trim()}**\n`;
        if (sub.content?.trim()) {
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
    {
      key: "problemUnderstanding",
      label: "Problem Understanding",
      data: problemUnderstanding,
    },
    { key: "algorithm", label: "Algorithm", data: algorithm },
    { key: "constraints", label: "Constraints", data: constraints },
    { key: "edgeCases", label: "Edge Cases", data: edgeCases },
    { key: "examples", label: "Examples", data: examples },
    { key: "approaches", label: "Approaches", data: approaches },
    {
      key: "justification",
      label: "Justification / Proof of Optimality",
      data: justification,
    },
    { key: "variants", label: "Variants / Follow-Ups", data: variants },
    { key: "tips", label: "Tips & Observations", data: tips },
  ];

  sectionsConfig.forEach((section) => {
    const { key, label, data } = section;
    if (!showSections[key]) return;

    let contentMd = "";

    // --- Sections with description + subsections ---
    if (
      [
        "problemUnderstanding",
        "constraints",
        "edgeCases",
        "justification",
        "variants",
        "tips",
      ].includes(key)
    ) {
      if (data?.description?.trim() || data?.subsections?.length) {
        contentMd = renderSectionContent(
          data.description || "",
          data.subsections || []
        );
      }
    }

    // --- Algorithm Section ---
    if (key === "algorithm" && Array.isArray(data)) {
      data.forEach((algo, i) => {
        if (
          algo.name?.trim() ||
          algo.description?.trim() ||
          algo.subsections?.length
        ) {
          contentMd += `### Algorithm ${i + 1}: ${algo.name || "Unnamed"}\n\n`;
          if (algo.description?.trim())
            contentMd += `${renderSectionContent(algo.description)}\n`;
          if (algo.subsections?.length)
            contentMd += renderSectionContent("", algo.subsections);
        }
      });
    }

    // --- Examples Section ---
    // --- Examples Section ---
    else if (key === "examples" && Array.isArray(data)) {
      const ex = data[0]; // only one main example object

      if (ex.description?.trim() || ex.subsections?.length) {
        // Wrap main description in code fence
        if (ex.description?.trim()) {
          contentMd += `\`\`\`text\n${ex.description.trim()}\n\`\`\`\n\n`;
        }

        // Render subsections (optional, future use)
        if (ex.subsections?.length) {
          ex.subsections.forEach((sub, idx) => {
            if (sub.content?.trim()) {
              contentMd += `### Subsection ${idx + 1}\n\n`;
              contentMd += `\`\`\`text\n${sub.content.trim()}\n\`\`\`\n\n`;
            }
          });
        }
      }
    }

    // --- Approaches Section ---
    else if (key === "approaches" && Array.isArray(data)) {
      data.forEach((app, i) => {
        if (
          app.name?.trim() ||
          app.idea?.trim() ||
          app.steps?.trim() ||
          app.pseudocode?.trim() ||
          app.javaCode?.trim() ||
          app.intuition?.trim() || // 💭 added
          app.complexity?.trim()
        ) {
          contentMd += `### Approach ${i + 1}: ${app.name || ""}\n\n`;
          if (app.idea?.trim())
            contentMd += `**Idea:**\n${renderSectionContent(app.idea)}\n`;
          if (app.steps?.trim())
            contentMd += `**Steps:**\n${renderSectionContent(app.steps)}\n`;
          if (app.pseudocode?.trim())
            contentMd += `**Pseudocode:**\n\`\`\`text\n${app.pseudocode.trim()}\n\`\`\`\n\n`;
          if (app.javaCode?.trim())
            contentMd += `**Java Code:**\n\`\`\`java\n${app.javaCode.trim()}\n\`\`\`\n\n`;

          // 💭 NEW: Intuition section
          if (app.intuition?.trim())
            contentMd += `**💭 Intuition Behind the Approach:**\n${renderSectionContent(
              app.intuition
            )}\n`;

          if (app.complexity?.trim())
            contentMd += `**Complexity (Time & Space):**\n${renderSectionContent(
              app.complexity
            )}\n`;
        }
      });
    }

    // --- Add section heading + content ---
    if (contentMd.trim()) {
      md += `## ${sectionNumber++}. ${label}\n\n`;
      md += contentMd.replace(/^\n+/, "");
      md += `---\n\n`;
    }
  });

  md += `<!-- #endregion -->\n\n`;
  return md.trimEnd() + "\n";
}

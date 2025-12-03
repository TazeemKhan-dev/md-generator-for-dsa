// utills/generateMarkdown.js
export function generateMarkdown({
  title,
  problemStatement,
  problemUnderstanding,
  algorithm,
  constraints,
  edgeCases,
  examples,
  approaches,
  justification,
  variants,
  tips,
  pitfalls,
  showSections,
}) {
  let md = "";
  let sectionNumber = 1;

  const escapeLine = (line) => line.replace(/\r/g, "");

  // Render a description/subsection content into bullet lines (preserving nested indentation)
  const renderBulleted = (text) => {
    if (!text) return "";
    const lines = text.split("\n");
    let out = "";

    for (let raw of lines) {
      if (!raw.trim()) continue;

      const line = raw.replace(/\t/g, "    "); // tabs → 4 spaces
      const indent = line.match(/^\s*/)[0]; // leading spaces
      const content = line.trim();

      // old behavior: top-level = "-", nested = "*"
      const bullet = indent.length === 0 ? "-" : "*";

      out += `${indent}${bullet} ${content}\n`;
    }

    return out;
  };

  // Render a single section which uses blocks array
  const renderBlocksSection = (sectionData) => {
    if (!sectionData || !Array.isArray(sectionData.blocks)) return "";
    let out = "";
    for (const block of sectionData.blocks) {
      if (!block) continue;
      if (block.type === "description") {
        if (block.content && block.content.trim()) {
          out += renderBulleted(block.content) + "\n";
        }
      } else if (block.type === "text") {
        // Render exact fenced code block preserving spacing
        out += "```text\n";
        out += block.content ? escapeLine(block.content) + "\n" : "\n";
        out += "```\n\n";
      } else if (block.type === "subsection") {
        // Skip empty subsections (heading empty OR content empty) — user requested skip if any subsection empty
        const heading = (block.heading || "").trim();
        const content = (block.content || "").trim();
        if (!heading && !content) {
          continue; // skip fully empty
        }
        if (!heading && content) {
          // If heading empty but content exists — render content as bulleted directly
          out += renderBulleted(content) + "\n";
        } else if (heading && !content) {
          // If heading present but no content — skip (user asked to not render empty subsection titles)
          continue;
        } else {
          // Has both heading and content
          out += `- **${heading}**\n`;
          out += renderBulleted(content) + "\n";
        }
      }
    }
    return out.trimEnd() + "\n";
  };

  // Title block
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

  const sections = [
    {
      key: "problemStatement",
      label: "Problem Statement",
      data: problemStatement,
    },
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
    { key: "pitfalls", label: "Pitfalls", data: pitfalls }, // NEW
  ];

  for (const s of sections) {
    const { key, label, data } = s;
    if (!showSections[key]) continue;

    let contentMd = "";

    // Blocks-based sections
    if (
      [
        "problemStatement",
        "problemUnderstanding",
        "constraints",
        "edgeCases",
        "justification",
        "variants",
        "tips",
        "pitfalls",
      ].includes(key)
    ) {
      contentMd = renderBlocksSection(data);
    }

    // Algorithm section (array)
    if (key === "algorithm" && Array.isArray(data)) {
      data.forEach((algo, i) => {
        if (
          algo &&
          (algo.name?.trim() ||
            algo.description?.trim() ||
            (algo.subsections && algo.subsections.length))
        ) {
          contentMd += `### Algorithm ${i + 1}: ${algo.name || "Unnamed"}\n\n`;
          if (algo.description?.trim())
            contentMd += renderBulleted(algo.description) + "\n\n";
          if (algo.subsections && algo.subsections.length) {
            // subsections here are simple {heading, content}
            algo.subsections.forEach((sub) => {
              if (!sub) return;
              const hh = (sub.heading || "").trim();
              const cc = (sub.content || "").trim();
              if (!hh && !cc) return;
              if (!hh && cc) contentMd += renderBulleted(cc) + "\n";
              else if (hh && cc) {
                contentMd += `- **${hh}**\n` + renderBulleted(cc) + "\n";
              }
            });
          }
        }
      });
    }

    // Examples (special: render main description as fenced block, subsections and extra text blocks)
    if (key === "examples" && Array.isArray(data)) {
      const ex = data[0];
      if (ex) {
        if (ex.description?.trim()) {
          // main examples description wrapped in fenced text
          contentMd +=
            "```text\n" + escapeLine(ex.description.trim()) + "\n```\n\n";
        }
        // any textBlocks (array)
        if (ex.textBlocks && ex.textBlocks.length) {
          ex.textBlocks.forEach((tb) => {
            contentMd +=
              "```text\n" + (tb ? escapeLine(tb) + "\n" : "\n") + "```\n\n";
          });
        }
        // subsections as separate fenced blocks
        if (ex.subsections && ex.subsections.length) {
          ex.subsections.forEach((sub, idx) => {
            if (!sub?.content?.trim()) return;
            contentMd += `### Subsection ${idx + 1}\n\n`;
            contentMd +=
              "```text\n" + escapeLine(sub.content.trim()) + "\n```\n\n";
          });
        }
      }
    }

    // Approaches
    if (key === "approaches" && Array.isArray(data)) {
      data.forEach((app, i) => {
        if (
          app &&
          (app.name?.trim() ||
            app.idea?.trim() ||
            app.steps?.trim() ||
            app.pseudocode?.trim() ||
            app.javaCode?.trim() ||
            app.intuition?.trim() ||
            app.complexity?.trim())
        ) {
          contentMd += `### Approach ${i + 1}: ${app.name || ""}\n\n`;
          if (app.idea?.trim())
            contentMd += `**Idea:**\n` + renderBulleted(app.idea) + "\n";
          if (app.steps?.trim())
            contentMd += `**Steps:**\n` + renderBulleted(app.steps) + "\n";
          if (app.pseudocode?.trim())
            contentMd += `**Pseudocode:**\n\`\`\`text\n${app.pseudocode.trim()}\n\`\`\`\n\n`;
          if (app.javaCode?.trim())
            contentMd += `**Java Code:**\n\`\`\`java\n${app.javaCode.trim()}\n\`\`\`\n\n`;
          if (app.intuition?.trim())
            contentMd +=
              `**💭 Intuition Behind the Approach:**\n` +
              renderBulleted(app.intuition) +
              "\n";
          if (app.complexity?.trim())
            contentMd +=
              `**Complexity (Time & Space):**\n` +
              renderBulleted(app.complexity) +
              "\n";
        }
      });
    }

    if (contentMd && contentMd.trim()) {
      md += `## ${sectionNumber++}. ${label}\n\n`;
      md += contentMd.replace(/^\n+/, "");
      md += `---\n\n`;
    }
  }

  md += "<!-- #endregion -->\n\n";
  return md.trimEnd() + "\n";
}

// App.js
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  FormControlLabel,
  Typography,
  IconButton,
  Stack,
  Switch,
  Grid,
  Box,
  Drawer,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { generateMarkdown } from "./utills/generateMarkdown";
import CloseIcon from "@mui/icons-material/Close";

const scrollSx = {
  "& .MuiOutlinedInput-root": {
    padding: "8px !important", // restore safe padding
  },
  "& textarea": {
    maxHeight: "250px !important",
    overflowY: "auto !important",
    padding: "5px !important", // padding inside textarea
    boxSizing: "border-box",

    /* Hide scrollbar */
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
  },
};

const approachSx = {
  "& .MuiOutlinedInput-root": {
    padding: "8px !important", // fix overlapping issue
  },
  "& textarea": {
    maxHeight: "180px !important",
    minHeight: "40px !important",
    overflowY: "auto !important",
    padding: "5 !important",
    boxSizing: "border-box",

    /* Hide scrollbar */
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
  },
};

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [title, setTitle] = useState("");

  const defaultShowSections = {
    problemStatement: true,
    problemUnderstanding: true,
    algorithm: false,
    constraints: true,
    edgeCases: true,
    examples: true,
    approaches: true,
    justification: true,
    variants: true,
    tips: true,
    pitfalls: true, // NEW
  };

  const [showSections, setShowSections] = useState(defaultShowSections);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState("");

  // For sections that need ordered blocks, use { blocks: [{type:'description'|'text'|'subsection', ...}] }
  const emptyBlocks = [{ type: "description", content: "" }];

  const [problemStatement, setProblemStatement] = useState({
    blocks: [...emptyBlocks],
  });

  const [problemUnderstanding, setProblemUnderstanding] = useState({
    blocks: [...emptyBlocks],
  });

  const [constraints, setConstraints] = useState({
    blocks: [...emptyBlocks],
  });

  const [edgeCases, setEdgeCases] = useState({
    blocks: [...emptyBlocks],
  });

  const [justification, setJustification] = useState({
    blocks: [...emptyBlocks],
  });

  const [variants, setVariants] = useState({
    blocks: [...emptyBlocks],
  });

  const [tips, setTips] = useState({
    blocks: [...emptyBlocks],
  });

  const [pitfalls, setPitfalls] = useState({
    blocks: [...emptyBlocks],
  });

  // Examples and approaches keep previous structure mostly, but examples will allow text blocks too
  const [examples, setExamples] = useState([
    { description: "", subsections: [], textBlocks: [] },
  ]);

  const [algorithms, setAlgorithms] = useState([
    { name: "", description: "", subsections: [] },
  ]);

  const [approaches, setApproaches] = useState([
    {
      name: "",
      idea: "",
      steps: "",
      javaCode: "",
      intuition: "",
      complexity: "",
    },
  ]);

  // Clear All resets everything
  const clearAll = () => {
    setTitle("");
    setShowSections(defaultShowSections);
    setExpandedSection("");
    setProblemStatement({ blocks: [...emptyBlocks] });
    setProblemUnderstanding({ blocks: [...emptyBlocks] });
    setConstraints({ blocks: [...emptyBlocks] });
    setEdgeCases({ blocks: [...emptyBlocks] });
    setJustification({ blocks: [...emptyBlocks] });
    setVariants({ blocks: [...emptyBlocks] });
    setTips({ blocks: [...emptyBlocks] });
    setPitfalls({ blocks: [...emptyBlocks] });

    setExamples([{ description: "", subsections: [], textBlocks: [] }]);
    setAlgorithms([{ name: "", description: "", subsections: [] }]);
    setApproaches([
      {
        name: "",
        idea: "",
        steps: "",
        javaCode: "",
        intuition: "",
        complexity: "",
      },
    ]);
    localStorage.removeItem("dsa_editor_data");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- TAB & SHIFT+TAB handler (same as before) --- */
  const handleTabKey = (e, value, onChange) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const insertSpaces = "  ";

    if (e.key === "Tab") {
      e.preventDefault();
      const val = value || "";
      const lines = val.substring(start, end).split("\n");
      const beforeSelection = val.substring(0, start);
      const afterSelection = val.substring(end);

      if (e.shiftKey) {
        const newLines = lines.map((line) =>
          line.startsWith(insertSpaces)
            ? line.substring(insertSpaces.length)
            : line.startsWith(" ")
            ? line.substring(1)
            : line
        );
        const newValue = beforeSelection + newLines.join("\n") + afterSelection;
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start + newLines.join("\n").length;
        }, 0);
      } else {
        const newLines = lines.map((line) => insertSpaces + line);
        const newValue = beforeSelection + newLines.join("\n") + afterSelection;
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = start + insertSpaces.length;
          textarea.selectionEnd = end + insertSpaces.length * lines.length;
        }, 0);
      }
    }
  };

  const downloadMarkdown = () => {
    const md = generateMarkdown({
      title,
      problemStatement,
      problemUnderstanding,
      algorithm: algorithms,
      constraints,
      edgeCases,
      examples,
      approaches,
      justification,
      variants,
      tips,
      pitfalls, // NEW
      showSections,
    });

    let filename = (title.trim() || "problem")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    if (!filename) filename = "problem";
    const fullFilename = `${filename}.md`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fullFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderAccordion = (key, label, icon, children) => (
    <Accordion
      key={key}
      expanded={expandedSection === key}
      TransitionProps={{ timeout: 0 }} // disable collapse animation
      onChange={(_, isExpanded) => {
        setExpandedSection(isExpanded ? key : "");

        if (isExpanded) {
          setTimeout(() => {
            const el = document.getElementById(`header-${key}`);
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }, 50); // tiny delay is enough now
        }
      }}
    >
      <AccordionSummary
        id={`header-${key}`} // <--- NEW ID FOR SCROLL TARGET
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {icon} {label}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
  useEffect(() => {
    const saved = localStorage.getItem("dsa_editor_data");
    if (saved) {
      const data = JSON.parse(saved);

      setTitle(data.title || "");
      setShowSections(data.showSections || defaultShowSections);
      setExpandedSection(data.expandedSection || "");

      setProblemStatement(
        data.problemStatement || { blocks: [...emptyBlocks] }
      );
      setProblemUnderstanding(
        data.problemUnderstanding || { blocks: [...emptyBlocks] }
      );
      setConstraints(data.constraints || { blocks: [...emptyBlocks] });
      setEdgeCases(data.edgeCases || { blocks: [...emptyBlocks] });
      setJustification(data.justification || { blocks: [...emptyBlocks] });
      setVariants(data.variants || { blocks: [...emptyBlocks] });
      setTips(data.tips || { blocks: [...emptyBlocks] });
      setPitfalls(data.pitfalls || { blocks: [...emptyBlocks] });

      setExamples(
        data.examples || [{ description: "", subsections: [], textBlocks: [] }]
      );
      setAlgorithms(
        data.algorithms || [{ name: "", description: "", subsections: [] }]
      );
      setApproaches(
        data.approaches || [
          {
            name: "",
            idea: "",
            steps: "",
            javaCode: "",
            intuition: "",
            complexity: "",
          },
        ]
      );
    }
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const data = {
        title,
        showSections,
        expandedSection,
        problemStatement,
        problemUnderstanding,
        constraints,
        edgeCases,
        justification,
        variants,
        tips,
        pitfalls,
        examples,
        algorithms,
        approaches,
      };

      localStorage.setItem("dsa_editor_data", JSON.stringify(data));
    }, 400); // debounce 400ms

    return () => clearTimeout(timeout);
  }, [
    title,
    showSections,
    expandedSection,
    problemStatement,
    problemUnderstanding,
    constraints,
    edgeCases,
    justification,
    variants,
    tips,
    pitfalls,
    examples,
    algorithms,
    approaches,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ px: 4, py: 6, maxWidth: "1250px", margin: "0 auto" }}>
        {/* Top-left settings icon */}
        {!drawerOpen && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ position: "fixed", top: 12, left: 12, zIndex: 2000 }}
            aria-label="open settings"
          >
            <SettingsIcon />
          </IconButton>
        )}

        {/* Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 320, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6">Sections</Typography>

              {/* ❌ Close Button */}
              <IconButton
                onClick={() => setDrawerOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 1 }} />

            <Grid container spacing={1}>
              {Object.keys(showSections).map((sec) => (
                <Grid item xs={12} key={sec}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showSections[sec]}
                        onChange={() =>
                          setShowSections({
                            ...showSections,
                            [sec]: !showSections[sec],
                          })
                        }
                      />
                    }
                    label={sec.replace(/([A-Z])/g, " $1").trim()}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Drawer>
        {!drawerOpen && (
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{ position: "fixed", top: 12, right: 12, zIndex: 2000 }}
          >
            {darkMode ? "🌙" : "☀️"}
          </IconButton>
        )}

        {/* Main editor */}
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Question Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Render section accordions in desired order */}
          {showSections.problemStatement &&
            renderAccordion(
              "problemStatement",
              "Problem Statement",
              "📝",
              <SectionEditorBlock
                state={problemStatement}
                setState={setProblemStatement}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.problemUnderstanding &&
            renderAccordion(
              "problemUnderstanding",
              "Problem Understanding",
              "💡",
              <SectionEditorBlock
                state={problemUnderstanding}
                setState={setProblemUnderstanding}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.algorithm &&
            renderAccordion(
              "algorithm",
              "Algorithm",
              "⚙️",
              <AlgorithmEditor
                algorithms={algorithms}
                setAlgorithms={setAlgorithms}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.constraints &&
            renderAccordion(
              "constraints",
              "Constraints",
              "📝",
              <SectionEditorBlock
                state={constraints}
                setState={setConstraints}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.edgeCases &&
            renderAccordion(
              "edgeCases",
              "Edge Cases",
              "⚠️",
              <SectionEditorBlock
                state={edgeCases}
                setState={setEdgeCases}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.examples &&
            renderAccordion(
              "examples",
              "Examples",
              "🧪",
              <ExamplesEditor
                examples={examples}
                setExamples={setExamples}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.approaches &&
            renderAccordion(
              "approaches",
              "Approaches",
              "🧠",
              <ApproachesEditor
                approaches={approaches}
                setApproaches={setApproaches}
                handleTabKey={handleTabKey}
                darkMode={darkMode}
              />
            )}

          {showSections.justification &&
            renderAccordion(
              "justification",
              "Justification / Proof",
              "✅",
              <SectionEditorBlock
                state={justification}
                setState={setJustification}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.variants &&
            renderAccordion(
              "variants",
              "Variants / Follow-Ups",
              "⏭️",
              <SectionEditorBlock
                state={variants}
                setState={setVariants}
                handleTabKey={handleTabKey}
              />
            )}

          {showSections.tips &&
            renderAccordion(
              "tips",
              "Tips & Observations",
              "💡",
              <SectionEditorBlock
                state={tips}
                setState={setTips}
                handleTabKey={handleTabKey}
              />
            )}

          {/* NEW: Pitfalls Section */}
          {showSections.pitfalls &&
            renderAccordion(
              "pitfalls",
              "Pitfalls",
              "⚠️",
              <SectionEditorBlock
                state={pitfalls}
                setState={setPitfalls}
                handleTabKey={handleTabKey}
              />
            )}

          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              onClick={downloadMarkdown}
              sx={{ flex: 1 }}
            >
              Download Markdown
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                if (e.detail === 2) clearAll();
              }}
              sx={{ flex: 1, borderWidth: "2px", borderColor: "error.main" }}
            >
              Clear All (Double Click)
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

/* --- SectionEditorBlock: supports ordered blocks (description, text, subsection) --- */
function SectionEditorBlock({ state, setState, handleTabKey }) {
  // state = { blocks: [{type:'description'|'text'|'subsection', content, heading?}] }
  const blocks = state.blocks || [];

  const updateBlock = (idx, newBlock) => {
    const newBlocks = [...blocks];
    newBlocks[idx] = newBlock;
    setState({ ...state, blocks: newBlocks });
  };

  const addTextBlock = () => {
    setState({ ...state, blocks: [...blocks, { type: "text", content: "" }] });
  };

  const addSubsection = () => {
    setState({
      ...state,
      blocks: [...blocks, { type: "subsection", heading: "", content: "" }],
    });
  };

  const deleteBlock = (idx) => {
    setState({ ...state, blocks: blocks.filter((_, i) => i !== idx) });
  };

  return (
    <Stack spacing={2}>
      {blocks.map((block, idx) => (
        <Box
          key={idx}
          sx={{
            borderLeft: block.type === "subsection" ? "3px solid #eee" : "none",
            pl: 1,
          }}
        >
          {block.type === "description" && (
            <TextField
              fullWidth
              label="Description"
              multiline
              minRows={2}
              sx={scrollSx}
              value={block.content}
              onChange={(e) =>
                updateBlock(idx, { ...block, content: e.target.value })
              }
              onKeyDown={(e) =>
                handleTabKey(e, block.content, (v) =>
                  updateBlock(idx, { ...block, content: v })
                )
              }
            />
          )}

          {block.type === "text" && (
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Text Block
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                sx={scrollSx}
                value={block.content}
                placeholder="Exact text preserved inside fenced block"
                onChange={(e) =>
                  updateBlock(idx, { ...block, content: e.target.value })
                }
                onKeyDown={(e) =>
                  handleTabKey(e, block.content, (v) =>
                    updateBlock(idx, { ...block, content: v })
                  )
                }
              />
            </Box>
          )}

          {block.type === "subsection" && (
            <Stack
              spacing={1}
              sx={{ borderLeft: "2px solid #ddd", pl: 2, pt: 1, pb: 1 }}
            >
              <TextField
                label="Subheading"
                value={block.heading}
                onChange={(e) =>
                  updateBlock(idx, { ...block, heading: e.target.value })
                }
              />
              <TextField
                label="Content (nested bullets supported)"
                multiline
                minRows={2}
                sx={scrollSx}
                value={block.content}
                onChange={(e) =>
                  updateBlock(idx, { ...block, content: e.target.value })
                }
                onKeyDown={(e) =>
                  handleTabKey(e, block.content, (v) =>
                    updateBlock(idx, { ...block, content: v })
                  )
                }
              />
            </Stack>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <IconButton
              size="small"
              onClick={() => deleteBlock(idx)}
              aria-label="delete block"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ))}

      <Stack direction="row" spacing={2}>
        <Button startIcon={<AddIcon />} onClick={addTextBlock}>
          Add Text
        </Button>
        <Button startIcon={<AddIcon />} onClick={addSubsection}>
          Add Subsection
        </Button>
      </Stack>
    </Stack>
  );
}

/* --- Algorithm Editor (keeps earlier behavior) --- */
function AlgorithmEditor({ algorithms, setAlgorithms, handleTabKey }) {
  const algo = algorithms[0] || { name: "", description: "", subsections: [] };

  const updateField = (key, value) => {
    const updated = { ...algo, [key]: value };
    setAlgorithms([updated]);
  };

  const updateSubsection = (idx, key, value) => {
    const newSubs = [...(algo.subsections || [])];
    newSubs[idx][key] = value;
    updateField("subsections", newSubs);
  };

  const addSubsection = () => {
    updateField("subsections", [
      ...(algo.subsections || []),
      { heading: "", content: "" },
    ]);
  };

  const deleteSubsection = (idx) => {
    updateField(
      "subsections",
      algo.subsections.filter((_, i) => i !== idx)
    );
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Algorithm Name"
        fullWidth
        value={algo.name || ""}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <TextField
        label="Algorithm Description"
        fullWidth
        multiline
        minRows={3}
        sx={scrollSx}
        value={algo.description || ""}
        onChange={(e) => updateField("description", e.target.value)}
        onKeyDown={(e) =>
          handleTabKey(e, algo.description, (v) =>
            updateField("description", v)
          )
        }
      />

      {(algo.subsections || []).map((sub, idx) => (
        <Stack
          key={idx}
          spacing={1}
          sx={{ borderLeft: "2px solid #ddd", pl: 2 }}
        >
          <TextField
            label="Subheading (e.g., Idea, Steps, Example)"
            value={sub.heading}
            onChange={(e) => updateSubsection(idx, "heading", e.target.value)}
          />
          <TextField
            label="Content (supports nested bullets)"
            multiline
            minRows={2}
            sx={scrollSx}
            value={sub.content}
            onChange={(e) => updateSubsection(idx, "content", e.target.value)}
            onKeyDown={(e) =>
              handleTabKey(e, sub.content, (v) =>
                updateSubsection(idx, "content", v)
              )
            }
          />
          <IconButton onClick={() => deleteSubsection(idx)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Button startIcon={<AddIcon />} onClick={addSubsection}>
        Add Subsection
      </Button>
    </Stack>
  );
}

/* --- Examples Editor (keeps earlier behavior but supports textBlocks array) --- */
function ExamplesEditor({ examples, setExamples, handleTabKey }) {
  const example = examples[0] || {
    description: "",
    subsections: [],
    textBlocks: [],
  };

  const updateDescription = (value) =>
    setExamples([{ ...example, description: value }]);

  const addTextBlock = () =>
    setExamples([
      { ...example, textBlocks: [...(example.textBlocks || []), ""] },
    ]);

  const updateTextBlock = (idx, v) => {
    const newT = [...(example.textBlocks || [])];
    newT[idx] = v;
    setExamples([{ ...example, textBlocks: newT }]);
  };

  const deleteTextBlock = (idx) => {
    setExamples([
      {
        ...example,
        textBlocks: example.textBlocks.filter((_, i) => i !== idx),
      },
    ]);
  };

  const addSubsection = () =>
    setExamples([
      {
        ...example,
        subsections: [...(example.subsections || []), { content: "" }],
      },
    ]);

  const updateSub = (idx, value) => {
    const newSubs = [...(example.subsections || [])];
    newSubs[idx].content = value;
    setExamples([{ ...example, subsections: newSubs }]);
  };

  const deleteSubsection = (idx) =>
    setExamples([
      {
        ...example,
        subsections: example.subsections.filter((_, i) => i !== idx),
      },
    ]);

  return (
    <Stack spacing={2}>
      <TextField
        label="Examples (main description)"
        fullWidth
        multiline
        minRows={4}
        sx={scrollSx}
        value={example.description}
        onChange={(e) => updateDescription(e.target.value)}
        onKeyDown={(e) =>
          handleTabKey(e, example.description, (v) => updateDescription(v))
        }
      />

      {(example.textBlocks || []).map((tb, idx) => (
        <Box key={idx}>
          <Typography sx={{ fontWeight: 600 }}>Text Block (fenced)</Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            sx={scrollSx}
            value={tb}
            onChange={(e) => updateTextBlock(idx, e.target.value)}
            onKeyDown={(e) =>
              handleTabKey(e, tb, (v) => updateTextBlock(idx, v))
            }
          />
          <IconButton onClick={() => deleteTextBlock(idx)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {(example.subsections || []).map((sub, idx) => (
        <Stack
          key={idx}
          spacing={1}
          sx={{ borderLeft: "2px solid #ddd", pl: 1 }}
        >
          <TextField
            label={`Subsection ${idx + 1}`}
            multiline
            minRows={3}
            sx={scrollSx}
            value={sub.content}
            onChange={(e) => updateSub(idx, e.target.value)}
            onKeyDown={(e) =>
              handleTabKey(e, sub.content, (v) => updateSub(idx, v))
            }
          />
          <IconButton onClick={() => deleteSubsection(idx)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Stack direction="row" spacing={2}>
        <Button startIcon={<AddIcon />} onClick={addTextBlock}>
          Add Text
        </Button>
        <Button startIcon={<AddIcon />} onClick={addSubsection}>
          Add Subsection
        </Button>
      </Stack>
    </Stack>
  );
}

/* --- Approaches Editor --- */
function ApproachesEditor({
  approaches,
  setApproaches,
  handleTabKey,
  darkMode,
}) {
  return (
    <Box
      sx={{
        maxHeight: "80vh", // FULL HEIGHT of approaches container
        overflowY: "auto", // scroll INSIDE this box
        p: 2,
        border: "1px solid #444",
        borderRadius: "8px",

        /* Hide scrollbar but still scrollable */
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "10px",
        },
      }}
    >
      <Stack spacing={2}>
        {approaches.map((app, idx) => (
          <Stack key={idx} spacing={1} border={1} borderRadius={2} padding={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Approach Name"
                fullWidth
                value={app.name}
                onChange={(e) => {
                  const newApps = [...approaches];
                  newApps[idx].name = e.target.value;
                  setApproaches(newApps);
                }}
              />
              <IconButton
                onClick={() =>
                  setApproaches(approaches.filter((_, i) => i !== idx))
                }
              >
                <DeleteIcon />
              </IconButton>
            </Stack>

            {/* IDEA */}
            <TextField
              label="Idea"
              fullWidth
              multiline
              minRows={2}
              maxRows={10}
              sx={approachSx}
              value={app.idea}
              onChange={(e) => {
                const newApps = [...approaches];
                newApps[idx].idea = e.target.value;
                setApproaches(newApps);
              }}
              onKeyDown={(e) =>
                handleTabKey(e, app.idea, (v) => {
                  const newApps = [...approaches];
                  newApps[idx].idea = v;
                  setApproaches(newApps);
                })
              }
            />

            {/* STEPS */}
            <TextField
              label="Steps"
              fullWidth
              multiline
              minRows={2}
              maxRows={10}
              sx={approachSx}
              value={app.steps}
              onChange={(e) => {
                const newApps = [...approaches];
                newApps[idx].steps = e.target.value;
                setApproaches(newApps);
              }}
              onKeyDown={(e) =>
                handleTabKey(e, app.steps, (v) => {
                  const newApps = [...approaches];
                  newApps[idx].steps = v;
                  setApproaches(newApps);
                })
              }
            />

            {/* JAVA CODE */}
            <Box sx={{ border: "1px solid #555", borderRadius: "6px" }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Java Code</Typography>

              <Editor
                height="250px"
                defaultLanguage="java"
                theme={darkMode ? "vs-dark" : "vs-light"}
                value={app.javaCode}
                onChange={(val) => {
                  const newApps = [...approaches];
                  newApps[idx].javaCode = val || "";
                  setApproaches(newApps);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  smoothScrolling: true,
                }}
              />
            </Box>

            {/* INTUITION */}
            <TextField
              label="💭 Intuition Behind the Approach"
              fullWidth
              multiline
              minRows={2}
              maxRows={10}
              sx={approachSx}
              value={app.intuition || ""}
              onChange={(e) => {
                const newApps = [...approaches];
                newApps[idx].intuition = e.target.value;
                setApproaches(newApps);
              }}
              onKeyDown={(e) =>
                handleTabKey(e, app.intuition || "", (v) => {
                  const newApps = [...approaches];
                  newApps[idx].intuition = v;
                  setApproaches(newApps);
                })
              }
            />

            {/* COMPLEXITY */}
            <TextField
              label="Complexity (Time & Space)"
              fullWidth
              multiline
              minRows={2}
              maxRows={10}
              sx={approachSx}
              value={app.complexity}
              onChange={(e) => {
                const newApps = [...approaches];
                newApps[idx].complexity = e.target.value;
                setApproaches(newApps);
              }}
              onKeyDown={(e) =>
                handleTabKey(e, app.complexity, (v) => {
                  const newApps = [...approaches];
                  newApps[idx].complexity = v;
                  setApproaches(newApps);
                })
              }
            />
          </Stack>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            setApproaches([
              ...approaches,
              {
                name: "",
                idea: "",
                steps: "",
                javaCode: "",
                intuition: "",
                complexity: "",
              },
            ])
          }
        >
          Add Approach
        </Button>
      </Stack>
    </Box>
  );
}

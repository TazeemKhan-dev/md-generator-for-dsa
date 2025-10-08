import React, { useState } from "react";
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
  Checkbox,Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { generateMarkdown } from "./utills/generateMarkdown";

export default function App() {
  const [title, setTitle] = useState("");

  const [showSections, setShowSections] = useState({
    problemUnderstanding: true,
    algorithm: true,
    constraints: true,
    edgeCases: true,
    examples: true,
    approaches: true,
    justification: true,
    variants: true,
    tips: true,
  });

  const [expandedSection, setExpandedSection] = useState("");

  const [problemUnderstanding, setProblemUnderstanding] = useState({
    description: "",
    subsections: [],
  });

  const [algorithms, setAlgorithms] = useState([
    { problem: "", example: "", idea: "", steps: "" },
  ]);

  const [constraints, setConstraints] = useState({
    description: "",
    subsections: [],
  });

  const [edgeCases, setEdgeCases] = useState({
    description: "",
    subsections: [],
  });

  const [examples, setExamples] = useState([{ type: "", input: "", output: "" }]);
const [approaches, setApproaches] = useState([
  { name: "", idea: "", steps: "", pseudocode: "", javaCode: "", complexity: "" },
]);


  const [justification, setJustification] = useState({
    description: "",
    subsections: [],
  });

  const [variants, setVariants] = useState({
    description: "",
    subsections: [],
  });

  const [tips, setTips] = useState({
    description: "",
    subsections: [],
  });

  const handleTabKey = (e, sectionState, setSectionState, idx, subfield) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const insertSpaces = "  ";
      if (subfield) {
        const newSub = [...sectionState.subsections];
        newSub[idx][subfield] += insertSpaces;
        setSectionState({ ...sectionState, subsections: newSub });
      } else {
        setSectionState({ ...sectionState, description: sectionState.description + insertSpaces });
      }
    }
  };

  const downloadMarkdown = () => {
    const md = generateMarkdown({
      title,
      problemUnderstanding,
      algorithm: algorithms,
      constraints,
      edgeCases,
      examples,
      approaches,
      justification,
      variants,
      tips,
      showSections,
    });

    let filename = (title.trim() || "problem").toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
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
      expanded={expandedSection === key}
      onChange={() => setExpandedSection(expandedSection === key ? "" : key)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{icon} {label}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );

  return (
     <><Box sx={{ padding: 20, maxWidth: "1200px", margin: "0 auto" }}>
     <Stack spacing={2} sx={{ padding: 4 }}>
      {/* Title Input */}
      <TextField
        fullWidth
        label="Question Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} />

      {/* Section Toggles */}
      <Stack direction="row" spacing={2}>
        {Object.keys(showSections).map((sec) => (
          <FormControlLabel
            key={sec}
            control={<Checkbox
              checked={showSections[sec]}
              onChange={() => setShowSections({ ...showSections, [sec]: !showSections[sec] })} />}
            label={sec.replace(/([A-Z])/g, " $1").trim()} />
        ))}
      </Stack>

      {/* Render all sections */}
      {showSections.problemUnderstanding && renderAccordion(
        "problemUnderstanding",
        "Understand the Problem",
        "💡",
        <SectionEditor state={problemUnderstanding} setState={setProblemUnderstanding} handleTabKey={handleTabKey} />
      )}

      {showSections.algorithm && renderAccordion(
        "algorithm",
        "Algorithm",
        "⚙️",
        <AlgorithmEditor algorithms={algorithms} setAlgorithms={setAlgorithms} handleTabKey={handleTabKey} />
      )}

      {showSections.constraints && renderAccordion(
        "constraints",
        "Constraints",
        "📝",
        <SectionEditor state={constraints} setState={setConstraints} handleTabKey={handleTabKey} />
      )}

      {showSections.edgeCases && renderAccordion(
        "edgeCases",
        "Edge Cases",
        "⚠️",
        <SectionEditor state={edgeCases} setState={setEdgeCases} handleTabKey={handleTabKey} />
      )}

      {showSections.examples && renderAccordion(
        "examples",
        "Examples",
        "🧪",
        <ExamplesEditor examples={examples} setExamples={setExamples} />
      )}

      {showSections.approaches && renderAccordion(
        "approaches",
        "Approaches",
        "🧠",
        <ApproachesEditor approaches={approaches} setApproaches={setApproaches} />
      )}

      {showSections.justification && renderAccordion(
        "justification",
        "Justification / Proof",
        "✅",
        <SectionEditor state={justification} setState={setJustification} handleTabKey={handleTabKey} />
      )}

      {showSections.variants && renderAccordion(
        "variants",
        "Variants / Follow-Ups",
        "⏭️",
        <SectionEditor state={variants} setState={setVariants} handleTabKey={handleTabKey} />
      )}

      {showSections.tips && renderAccordion(
        "tips",
        "Tips & Observations",
        "💡",
        <SectionEditor state={tips} setState={setTips} handleTabKey={handleTabKey} />
      )}

      <Button startIcon={<DownloadIcon />} variant="contained" onClick={downloadMarkdown}>
        Download Markdown
      </Button>
    </Stack>
        </Box>
          </>
  );
}

/* --- Reusable SectionEditor --- */
function SectionEditor({ state, setState, handleTabKey }) {
  return (
    <Stack spacing={1}>
      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Description"
        value={state.description}
        onChange={(e) => setState({ ...state, description: e.target.value })}
        onKeyDown={(e) => handleTabKey(e, state, setState)}
      />
      {state.subsections.map((sub, idx) => (
        <Stack key={idx} spacing={1} sx={{ borderLeft: "2px solid #ddd", pl: 1 }}>
          <TextField
            label="Subheading"
            value={sub.heading}
            onChange={(e) => {
              const newSub = [...state.subsections];
              newSub[idx].heading = e.target.value;
              setState({ ...state, subsections: newSub });
            }}
          />
          <TextField
            label="Content (nested bullets supported)"
            multiline
            minRows={2}
            value={sub.content}
            onChange={(e) => {
              const newSub = [...state.subsections];
              newSub[idx].content = e.target.value;
              setState({ ...state, subsections: newSub });
            }}
            onKeyDown={(e) => handleTabKey(e, state, setState, idx, "content")}
          />
          <IconButton
            onClick={() =>
              setState({
                ...state,
                subsections: state.subsections.filter((_, i) => i !== idx),
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          setState({
            ...state,
            subsections: [...state.subsections, { heading: "", content: "" }],
          })
        }
      >
        Add Subsection
      </Button>
    </Stack>
  );
}

/* --- Algorithm Editor --- */
/* --- Algorithm Editor (Now like Problem Understanding) --- */
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
    updateField("subsections", [...(algo.subsections || []), { heading: "", content: "" }]);
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
        value={algo.description || ""}
        onChange={(e) => updateField("description", e.target.value)}
        onKeyDown={(e) => handleTabKey(e, algo, setAlgorithms)}
      />

      {(algo.subsections || []).map((sub, idx) => (
        <Stack key={idx} spacing={1} sx={{ borderLeft: "2px solid #ddd", pl: 2 }}>
          <TextField
            label="Subheading (e.g., Idea, Steps, Example)"
            value={sub.heading}
            onChange={(e) => updateSubsection(idx, "heading", e.target.value)}
          />
          <TextField
            label="Content (supports nested bullets)"
            multiline
            minRows={2}
            value={sub.content}
            onChange={(e) => updateSubsection(idx, "content", e.target.value)}
            onKeyDown={(e) => handleTabKey(e, algo, setAlgorithms, idx, "content")}
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

/* --- Examples Editor (Single field + Subsections like Problem Understanding) --- */
function ExamplesEditor({ examples, setExamples }) {
  const example = examples[0] || { description: "", subsections: [] };

  const updateDescription = (value) => {
    setExamples([{ ...example, description: value }]);
  };

  const addSubsection = () => {
    setExamples([{ ...example, subsections: [...(example.subsections || []), { content: "" }] }]);
  };

  const updateSub = (idx, value) => {
    const newSubs = [...(example.subsections || [])];
    newSubs[idx].content = value;
    setExamples([{ ...example, subsections: newSubs }]);
  };

  const deleteSubsection = (idx) => {
    setExamples([{ ...example, subsections: example.subsections.filter((_, i) => i !== idx) }]);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Examples (paste all examples here)"
        fullWidth
        multiline
        minRows={5}
        value={example.description}
        onChange={(e) => updateDescription(e.target.value)}
      />

      {(example.subsections || []).map((sub, idx) => (
        <Stack key={idx} spacing={1} sx={{ borderLeft: "2px solid #ddd", pl: 1 }}>
          <TextField
            label={`Subsection ${idx + 1}`}
            multiline
            minRows={3}
            value={sub.content}
            onChange={(e) => updateSub(idx, e.target.value)}
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

/* --- Approaches Editor --- */
function ApproachesEditor({ approaches, setApproaches }) {
  return (
    
    <Stack spacing={2} >
      {approaches.map((app, i) => (
        <Stack key={i} spacing={1} border={1} borderRadius={2} padding={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Approach Name"
              fullWidth
              value={app.name}
              onChange={(e) => {
                const newApp = [...approaches];
                newApp[i].name = e.target.value;
                setApproaches(newApp);
              }}
            />
            <IconButton onClick={() => setApproaches(approaches.filter((_, idx) => idx !== i))}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Idea"
            fullWidth
            multiline
            rows={2}
            value={app.idea}
            onChange={(e) => {
              const newApp = [...approaches];
              newApp[i].idea = e.target.value;
              setApproaches(newApp);
            }}
          />
          <TextField
            label="Steps"
            fullWidth
            multiline
            rows={2}
            value={app.steps}
            onChange={(e) => {
              const newApp = [...approaches];
              newApp[i].steps = e.target.value;
              setApproaches(newApp);
            }}
          />
          <TextField
            label="Pseudocode"
            fullWidth
            multiline
            rows={3}
            value={app.pseudocode}
            onChange={(e) => {
              const newApp = [...approaches];
              newApp[i].pseudocode = e.target.value;
              setApproaches(newApp);
            }}
          />
          <TextField
            label="Java Code"
            fullWidth
            multiline
            rows={3}
            value={app.javaCode}
            onChange={(e) => {
              const newApp = [...approaches];
              newApp[i].javaCode = e.target.value;
              setApproaches(newApp);
            }}
          />
 <TextField
  label="Complexity (Time & Space)"
  fullWidth
  multiline
  minRows={2}
  value={app.complexity}
  onChange={(e) => {
    const newApp = [...approaches];
    newApp[i].complexity = e.target.value;
    setApproaches(newApp);
  }}
  onKeyDown={(e) => {
    // Reuse handleTabKey to allow nested bullets
    if (e.key === "Tab") {
      e.preventDefault();
      const insertSpaces = "  ";
      const newApp = [...approaches];
      newApp[i].complexity += insertSpaces;
      setApproaches(newApp);
    }
  }}
/>


        </Stack>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          setApproaches([
            ...approaches,
            { name: "", idea: "", steps: "", pseudocode: "", javaCode: "", timeComplexity: "", spaceComplexity: "" },
          ])
        }
      >
        Add Approach
      </Button>
    </Stack>
  );
}

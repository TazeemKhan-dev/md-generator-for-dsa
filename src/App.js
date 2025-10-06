import React, { useState } from "react";
import remarkGfm from 'remark-gfm'; // <-- ADD THIS
import rehypeRaw from 'rehype-raw'; // <-- ADD THIS
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
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ReactMarkdown from "react-markdown";
import { generateMarkdown } from "./utills/generateMarkdown";

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [title, setTitle] = useState("");

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  // Section visibility toggles
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

  // Track currently open accordion section
  const [expandedSection, setExpandedSection] = useState("");

  // Section states
  const [problemUnderstanding, setProblemUnderstanding] = useState({
    description: "",
    subsections: [{ heading: "", content: "" }],
  });

  const [algorithms, setAlgorithms] = useState([
    { problem: "", example: "", idea: "", steps: "" },
  ]);

  const [constraints, setConstraints] = useState({
    description: "",
    subsections: [{ heading: "", content: "" }],
  });

  const [edgeCases, setEdgeCases] = useState({
    description: "",
    subsections: [{ heading: "", content: "" }],
  });

  const [examples, setExamples] = useState([{ type: "", input: "", output: "" }]);

  const [approaches, setApproaches] = useState([
    { name: "", idea: "", steps: "", pseudocode: "", javaCode: "", timeComplexity: "", spaceComplexity: "" },
  ]);

  const [justification, setJustification] = useState({
    description: "",
    subsections: [{ heading: "", content: "" }],
  });

  const [variants, setVariants] = useState({
    description: "",
    subsections: [{ heading: "", content: "" }],
  });

  const [tips, setTips] = useState({
    description: "",
    subsections: [{ heading: "", content: "" }],
  });

  // Handle Tab key for nested bullets
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

// Inside your App component in app.js

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
    
    // --- START OF CHANGE ---
    // 1. Sanitize the title for use as a filename
    let filename = (title.trim() || "problem").toLowerCase() // Use title or default, make lowercase
        .replace(/\s+/g, '-')       // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '')   // Remove all non-word characters (like colons, slashes, etc.)
        .replace(/\-\-+/g, '-')     // Replace multiple hyphens with a single one
        .replace(/^-+/, '')         // Remove leading hyphens
        .replace(/-+$/, '');        // Remove trailing hyphens

    // Ensure it's not empty after sanitation
    if (!filename) filename = "problem"; 
    
    // Append the .md extension
    const fullFilename = `${filename}.md`;
    // --- END OF CHANGE ---

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    // Use the generated, sanitized filename
    a.download = fullFilename; 
    
    a.click();
    URL.revokeObjectURL(url);
};

  // Generic Accordion rendering
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
    <Stack spacing={2} sx={{ paddingLeft: "100px", paddingRight: "100px", paddingTop: 2, paddingBottom: 2 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        {title ? `Q: ${title}` : "Enter Question Title"}
      </Typography>
      <TextField
        fullWidth
        label="Question Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Tabs */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Editor" />
          <Tab label="Preview" />
        </Tabs>
        <Button startIcon={<DownloadIcon />} variant="contained" onClick={downloadMarkdown}>
          Download Markdown
        </Button>
      </Stack>

      {tabIndex === 0 && (
        <Stack spacing={2}>
          {/* Section Toggles */}
          <Stack direction="row" spacing={2}>
            {Object.keys(showSections).map((sec) => (
              <FormControlLabel
                key={sec}
                control={
                  <Checkbox
                    checked={showSections[sec]}
                    onChange={() =>
                      setShowSections({ ...showSections, [sec]: !showSections[sec] })
                    }
                  />
                }
                label={sec.replace(/([A-Z])/g, " $1").trim()}
              />
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
        </Stack>
      )}

      {/* Markdown Preview Tab */}
      {tabIndex === 1 && (
        <Stack
          sx={{
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            minHeight: "400px",
            backgroundColor: "#fafafa",
          }}
        >
          <ReactMarkdown  remarkPlugins={[remarkGfm]} // enables features like tables, task lists, etc.
  rehypePlugins={[rehypeRaw]}>
            {generateMarkdown({
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
            })}
          </ReactMarkdown>
        </Stack>
      )}
    </Stack>
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
            onClick={() => {
              setState({
                ...state,
                subsections: state.subsections.filter((_, i) => i !== idx),
              });
            }}
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
function AlgorithmEditor({ algorithms, setAlgorithms, handleTabKey }) {
  return (
    <Stack spacing={2}>
      {algorithms.map((algo, idx) => (
        <Stack key={idx} spacing={1} sx={{ borderLeft: "2px solid #ddd", pl: 1 }}>
          <TextField
            label="Problem"
            value={algo.problem}
            onChange={(e) => {
              const newAlgo = [...algorithms];
              newAlgo[idx].problem = e.target.value;
              setAlgorithms(newAlgo);
            }}
            fullWidth
          />
          <TextField
            label="Example"
            multiline
            minRows={2}
            value={algo.example}
            onChange={(e) => {
              const newAlgo = [...algorithms];
              newAlgo[idx].example = e.target.value;
              setAlgorithms(newAlgo);
            }}
          />
          <TextField
            label="Idea (nested bullets supported)"
            multiline
            minRows={2}
            value={algo.idea}
            onChange={(e) => {
              const newAlgo = [...algorithms];
              newAlgo[idx].idea = e.target.value;
              setAlgorithms(newAlgo);
            }}
            onKeyDown={(e) => handleTabKey(e, algorithms, setAlgorithms, idx, "idea")}
          />
          <TextField
            label="Steps (nested bullets supported)"
            multiline
            minRows={2}
            value={algo.steps}
            onChange={(e) => {
              const newAlgo = [...algorithms];
              newAlgo[idx].steps = e.target.value;
              setAlgorithms(newAlgo);
            }}
            onKeyDown={(e) => handleTabKey(e, algorithms, setAlgorithms, idx, "steps")}
          />
          <IconButton onClick={() => setAlgorithms(algorithms.filter((_, i) => i !== idx))}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          setAlgorithms([...algorithms, { problem: "", example: "", idea: "", steps: "" }])
        }
      >
        Add Algorithm
      </Button>
    </Stack>
  );
}

/* --- Examples Editor --- */
function ExamplesEditor({ examples, setExamples }) {
  return (
    <Stack spacing={2}>
      {examples.map((ex, i) => (
        <Stack key={i} spacing={1} border={1} borderRadius={2} padding={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Type"
              value={ex.type}
              onChange={(e) => {
                const newEx = [...examples];
                newEx[i].type = e.target.value;
                setExamples(newEx);
              }}
            />
            <IconButton onClick={() => setExamples(examples.filter((_, idx) => idx !== i))}>
              <DeleteIcon />
            </IconButton>
          </Stack>
          <TextField
            label="Input"
            fullWidth
            multiline
            rows={2}
            value={ex.input}
            onChange={(e) => {
              const newEx = [...examples];
              newEx[i].input = e.target.value;
              setExamples(newEx);
            }}
          />
          <TextField
            label="Output"
            fullWidth
            multiline
            rows={2}
            value={ex.output}
            onChange={(e) => {
              const newEx = [...examples];
              newEx[i].output = e.target.value;
              setExamples(newEx);
            }}
          />
        </Stack>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => setExamples([...examples, { type: "", input: "", output: "" }])}
      >
        Add Example
      </Button>
    </Stack>
  );
}

/* --- Approaches Editor --- */
function ApproachesEditor({ approaches, setApproaches }) {
  return (
    <Stack spacing={2}>
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
            label="Time Complexity"
            fullWidth
            value={app.timeComplexity}
            onChange={(e) => {
              const newApp = [...approaches];
              newApp[i].timeComplexity = e.target.value;
              setApproaches(newApp);
            }}
          />
          <TextField
            label="Space Complexity"
            fullWidth
            value={app.spaceComplexity}
            onChange={(e) => {
              const newApp = [...approaches];
              newApp[i].spaceComplexity = e.target.value;
              setApproaches(newApp);
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


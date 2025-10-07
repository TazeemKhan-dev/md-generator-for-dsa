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
/* --- Examples Editor --- */
function ExamplesEditor({ examples, setExamples }) {
  return (
    <Stack spacing={2}>
      {examples.map((ex, i) => (
        <Stack key={i} spacing={1} border={1} borderRadius={2} padding={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1">Example {i + 1}</Typography>
            <IconButton onClick={() => setExamples(examples.filter((_, idx) => idx !== i))}>
              <DeleteIcon />
            </IconButton>
          </Stack>

          <TextField
            label="Example Content (Input + Output or any text)"
            fullWidth
            multiline
            minRows={5}
            value={ex.content || ""}
            onChange={(e) => {
              const newEx = [...examples];
              newEx[i].content = e.target.value;
              setExamples(newEx);
            }}
            onKeyDown={(e) => {
              // Allow tab indentation for nested formatting
              if (e.key === "Tab") {
                e.preventDefault();
                const insertSpaces = "  ";
                const newEx = [...examples];
                newEx[i].content = (newEx[i].content || "") + insertSpaces;
                setExamples(newEx);
              }
            }}
          />
        </Stack>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => setExamples([...examples, { content: "" }])}
      >
        Add Example
      </Button>
    </Stack>
  );
}

// function ExamplesEditor({ examples, setExamples }) {
//   return (
//     <Stack spacing={2}>
//       {examples.map((ex, i) => (
//         <Stack key={i} spacing={1} border={1} borderRadius={2} padding={1}>
//           <Stack direction="row" spacing={1} alignItems="center">
//             <TextField
//               label="Type"
//               value={ex.type}
//               onChange={(e) => {
//                 const newEx = [...examples];
//                 newEx[i].type = e.target.value;
//                 setExamples(newEx);
//               }}
//             />
//             <IconButton onClick={() => setExamples(examples.filter((_, idx) => idx !== i))}>
//               <DeleteIcon />
//             </IconButton>
//           </Stack>
//           <TextField
//             label="Input"
//             fullWidth
//             multiline
//             rows={2}
//             value={ex.input}
//             onChange={(e) => {
//               const newEx = [...examples];
//               newEx[i].input = e.target.value;
//               setExamples(newEx);
//             }}
//           />
//           <TextField
//             label="Output"
//             fullWidth
//             multiline
//             rows={2}
//             value={ex.output}
//             onChange={(e) => {
//               const newEx = [...examples];
//               newEx[i].output = e.target.value;
//               setExamples(newEx);
//             }}
//           />
//         </Stack>
//       ))}
//       <Button
//         startIcon={<AddIcon />}
//         onClick={() => setExamples([...examples, { type: "", input: "", output: "" }])}
//       >
//         Add Example
//       </Button>
//     </Stack>
//   );
// }

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

import React, { useState } from "react";
import { generateMarkdown } from "./utills/generateMarkdown";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  // Toggle sections
  const [showSections, setShowSections] = useState({
    problemUnderstanding: true,
    inputOutput: true,
    constraints: true,
    examples: true,
    approaches: true,
    justification: true,
    variants: true,
  });

  const [title, setTitle] = useState("");
  const [problemUnderstanding, setProblemUnderstanding] = useState({
    readIdentify: "",
    goal: "",
    paraphrase: "",
  });
  const [inputOutput, setInputOutput] = useState({ input: "", output: "" });
  const [constraints, setConstraints] = useState([""]);
  const [examples, setExamples] = useState([
    { input: "", output: "", type: "" },
  ]);
  const [approaches, setApproaches] = useState([
    {
      name: "",
      idea: "",
      pseudocode: "",
      javaCode: "",
      timeComplexity: "",
      spaceComplexity: "",
      showJava: true,
      showPseudocode: true,
    },
  ]);
  const [justification, setJustification] = useState([""]);
  const [variants, setVariants] = useState([""]);

  const handleDownload = () => {
    const mdContent = generateMarkdown({
      title,
      problemUnderstanding: showSections.problemUnderstanding
        ? problemUnderstanding
        : {},
      inputOutput: showSections.inputOutput ? inputOutput : {},
      constraints: showSections.constraints ? constraints : [],
      examples: showSections.examples ? examples : [],
      approaches: showSections.approaches ? approaches : [],
      justification: showSections.justification ? justification : [],
      variants: showSections.variants ? variants : [],
    });
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title || "problem"}.md`;
    link.click();
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Markdown Problem Generator
      </Typography>
      <TextField
        label="Problem Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Section toggles */}
      <Stack direction="row" spacing={2} marginY={2}>
        {Object.keys(showSections).map((sec) => (
          <FormControlLabel
            key={sec}
            control={
              <Checkbox
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
        ))}
      </Stack>

      {/* Problem Understanding */}
      {showSections.problemUnderstanding && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>💡 Understand the Problem</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Read & Identify"
                fullWidth
                value={problemUnderstanding.readIdentify}
                onChange={(e) =>
                  setProblemUnderstanding({
                    ...problemUnderstanding,
                    readIdentify: e.target.value,
                  })
                }
              />
              <TextField
                label="Goal"
                fullWidth
                value={problemUnderstanding.goal}
                onChange={(e) =>
                  setProblemUnderstanding({
                    ...problemUnderstanding,
                    goal: e.target.value,
                  })
                }
              />
              <TextField
                label="Paraphrase"
                fullWidth
                value={problemUnderstanding.paraphrase}
                onChange={(e) =>
                  setProblemUnderstanding({
                    ...problemUnderstanding,
                    paraphrase: e.target.value,
                  })
                }
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Input & Output */}
      {showSections.inputOutput && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>📋 Input & Output</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Input (multi-line allowed)"
                fullWidth
                multiline
                rows={3}
                value={inputOutput.input}
                onChange={(e) =>
                  setInputOutput({ ...inputOutput, input: e.target.value })
                }
              />
              <TextField
                label="Output (multi-line allowed)"
                fullWidth
                multiline
                rows={3}
                value={inputOutput.output}
                onChange={(e) =>
                  setInputOutput({ ...inputOutput, output: e.target.value })
                }
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Constraints */}
      {showSections.constraints && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Constraints</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {constraints.map((c, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={1}
                  alignItems="flex-start"
                >
                  <TextField
                    label={`Constraint ${i + 1} (use line breaks for multiple)`}
                    fullWidth
                    multiline
                    rows={2}
                    value={c}
                    onChange={(e) => {
                      const newC = [...constraints];
                      newC[i] = e.target.value;
                      setConstraints(newC);
                    }}
                  />
                  <IconButton
                    onClick={() =>
                      setConstraints(constraints.filter((_, idx) => idx !== i))
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setConstraints([...constraints, ""])}
              >
                Add Constraint
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Examples */}
      {showSections.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>🧪 Examples</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {examples.map((ex, i) => (
                <Stack key={i} spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Type"
                      value={ex.type}
                      onChange={(e) => {
                        const newEx = [...examples];
                        newEx[i].type = e.target.value;
                        setExamples(newEx);
                      }}
                    />
                    <IconButton
                      onClick={() =>
                        setExamples(examples.filter((_, idx) => idx !== i))
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <TextField
                    label="Input (multi-line allowed)"
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
                    label="Output (multi-line allowed)"
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
                onClick={() =>
                  setExamples([
                    ...examples,
                    { input: "", output: "", type: "" },
                  ])
                }
              >
                Add Example
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Approaches */}
      {showSections.approaches && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>🧠 Approaches</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {approaches.map((app, i) => (
                <Stack
                  key={i}
                  spacing={1}
                  border={1}
                  borderRadius={2}
                  padding={1}
                >
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
                    <IconButton
                      onClick={() =>
                        setApproaches(approaches.filter((_, idx) => idx !== i))
                      }
                    >
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
                  {app.showPseudocode && (
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
                  )}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={app.showPseudocode}
                        onChange={() => {
                          const newApp = [...approaches];
                          newApp[i].showPseudocode = !newApp[i].showPseudocode;
                          setApproaches(newApp);
                        }}
                      />
                    }
                    label="Show Pseudocode"
                  />
                  {app.showJava && (
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
                  )}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={app.showJava}
                        onChange={() => {
                          const newApp = [...approaches];
                          newApp[i].showJava = !newApp[i].showJava;
                          setApproaches(newApp);
                        }}
                      />
                    }
                    label="Show Java Code"
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
                    {
                      name: "",
                      idea: "",
                      pseudocode: "",
                      javaCode: "",
                      timeComplexity: "",
                      spaceComplexity: "",
                      showJava: true,
                      showPseudocode: true,
                    },
                  ])
                }
              >
                Add Approach
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Justification */}
      {showSections.justification && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>✅ Justification / Proof</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {justification.map((j, i) => (
                <Stack key={i} direction="row" spacing={1}>
                  <TextField
                    label={`Justification ${i + 1} (multi-line allowed)`}
                    fullWidth
                    multiline
                    rows={2}
                    value={j}
                    onChange={(e) => {
                      const newJ = [...justification];
                      newJ[i] = e.target.value;
                      setJustification(newJ);
                    }}
                  />
                  <IconButton
                    onClick={() =>
                      setJustification(
                        justification.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setJustification([...justification, ""])}
              >
                Add Justification
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Variants */}
      {showSections.variants && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>⏭️ Variants / Follow-Ups</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {variants.map((v, i) => (
                <Stack key={i} direction="row" spacing={1}>
                  <TextField
                    label={`Variant ${i + 1} (multi-line allowed)`}
                    fullWidth
                    multiline
                    rows={2}
                    value={v}
                    onChange={(e) => {
                      const newV = [...variants];
                      newV[i] = e.target.value;
                      setVariants(newV);
                    }}
                  />
                  <IconButton
                    onClick={() =>
                      setVariants(variants.filter((_, idx) => idx !== i))
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setVariants([...variants, ""])}
              >
                Add Variant
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      <Stack mt={3}>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download Markdown
        </Button>
      </Stack>
    </div>
  );
}

export default App;

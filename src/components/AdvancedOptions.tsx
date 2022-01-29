import { useState, type ChangeEvent } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

interface AdvancedOptionsProps {
    onJavaPathChange(
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void;
    onJvmArgsChange(
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void;
}

const AdvancedOptions = ({
    onJavaPathChange,
    onJvmArgsChange,
}: AdvancedOptionsProps): JSX.Element => {
    const [javaPath, setJavaPath] = useState("");
    const [jvmArgs, setJvmArgs] = useState<string | undefined>();

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="advanced-content"
                id="advanced-header"
            >
                <Typography>Advanced Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div className="flex flex-col gap-2">
                    <TextField
                        name="java-path"
                        label="Java Path (advanced)"
                        placeholder="java"
                        value={javaPath ?? ""}
                        onChange={(e) => {
                            setJavaPath(e.target.value);
                            onJavaPathChange(e);
                        }}
                    />
                    <TextField
                        name="jvm-args"
                        label="JVM Args (advanced)"
                        placeholder="-Xmx1024M"
                        value={jvmArgs}
                        onChange={(e) => {
                            setJvmArgs(e.target.value);
                            onJvmArgsChange(e);
                        }}
                    />
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

export default AdvancedOptions;

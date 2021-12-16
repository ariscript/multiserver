import React, { useState, useEffect, useRef } from "react";

import "../app.global.css";

interface ReplCommandData {
    command: string;
    data: string;
}

interface ReplProps {
    exec(command: string): Promise<string>;
}

const Repl = ({ exec }: ReplProps): JSX.Element => {
    const [history, setHistory] = useState<ReplCommandData[]>([]);
    const [commands, setCommands] = useState<ReplCommandData[]>([]);
    const [command, setCommand] = useState("");
    const [isExec, setIsExec] = useState(false);
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);

    const log = useRef<HTMLDivElement>(null);
    const term = useRef<HTMLPreElement>(null);

    useEffect(() => {
        setCommands(history.filter(({ command }) => command));

        if (term.current) term.current.scrollTop = term.current?.scrollHeight;
    }, [history]);

    useEffect(() => {
        if (index && commands[index - 1])
            setCommand(commands[index - 1].command);
        else if (!index) setCommand("");
    }, [index]);

    return (
        <pre ref={term} className="overflow-scroll">
            <div ref={log}>
                {[...history].reverse().map((e, i) => (
                    <div key={i}>
                        <span>
                            {">"} {e.command}
                        </span>
                        <div>{e.data}</div>
                    </div>
                ))}
            </div>
            {placeholder && (
                <span>
                    {">"} {placeholder}
                </span>
            )}
            <div>
                {!isExec && <span>{"> "}</span>}
                <input
                    autoFocus
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={async (e) => {
                        if (e.code === "Enter") {
                            if (command) {
                                setPlaceholder(command);
                                setCommand("");

                                const data = await exec(command);
                                setPlaceholder("");

                                setHistory([{ command, data }, ...history]);
                                return;
                            }
                            setHistory([{ command, data: "" }, ...history]);
                        } else if (e.code === "ArrowUp") {
                            if (index < commands.length)
                                return setIndex(index + 1);
                        } else if (e.code === "ArrowDown") {
                            if (index > 0) return setIndex(index - 1);
                        }
                    }}
                />
            </div>
        </pre>
    );
};

export default Repl;

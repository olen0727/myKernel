import { Extension, Editor, Range } from "@tiptap/core";
import Suggestion, { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance, Props } from "tippy.js";
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Text,
    CheckSquare,
    Image as ImageIcon,
    Code
} from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";

interface CommandItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: (props: { editor: Editor; range: Range }) => void;
}

interface CommandListProps {
    items: CommandItemProps[];
    command: (item: CommandItemProps) => void;
    editor: Editor;
}

const CommandList = forwardRef<any, CommandListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === "ArrowUp") {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }
            if (event.key === "ArrowDown") {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }
            if (event.key === "Enter") {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    return (
        <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md transition-all">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Basic Blocks</div>
            {props.items.map((item, index) => (
                <button
                    className={cn(
                        "flex w-full items-center space-x-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground",
                        index === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    <div className="flex items-center justify-center rounded-sm border border-muted bg-background h-8 w-8 shrink-0">
                        {item.icon}
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-[10px] text-muted-foreground">{item.description}</span>
                    </div>
                </button>
            ))}
        </div>
    );
});

CommandList.displayName = "CommandList";

const renderItems = () => {
    let component: ReactRenderer<any> | null = null;
    let popup: Instance<Props>[] | null = null;

    return {
        onStart: (props: SuggestionProps<any>) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            if (!props.clientRect) {
                return;
            }

            // @ts-ignore
            popup = tippy("body", {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
            });
        },
        onUpdate: (props: SuggestionProps<any>) => {
            component?.updateProps(props);

            if (!props.clientRect) {
                return;
            }
            popup?.[0].setProps({
                getReferenceClientRect: props.clientRect as any,
            });
        },
        onKeyDown: (props: SuggestionKeyDownProps) => {
            if (props.event.key === "Escape") {
                popup?.[0].hide();
                return true;
            }

            // @ts-ignore
            return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
            popup?.[0].destroy();
            component?.destroy();
        },
    };
};

const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: "Text",
            description: "Just start writing with plain text.",
            icon: <Text className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode("paragraph", "paragraph")
                    .run();
            },
        },
        {
            title: "Heading 1",
            description: "Big section heading.",
            icon: <Heading1 className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run();
            },
        },
        {
            title: "Heading 2",
            description: "Medium section heading.",
            icon: <Heading2 className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run();
            },
        },
        {
            title: "Heading 3",
            description: "Small section heading.",
            icon: <Heading3 className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 3 })
                    .run();
            },
        },
        {
            title: "Bullet List",
            description: "Create a simple bullet list.",
            icon: <List className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: "Numbered List",
            description: "Create a list with numbering.",
            icon: <ListOrdered className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: "To-do List",
            description: "Track tasks with a to-do list.",
            icon: <CheckSquare className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
        },
        {
            title: "Code Block",
            description: "Capture a code snippet.",
            icon: <Code className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            },
        },
        {
            title: "Image",
            description: "Upload an image from your computer.",
            icon: <ImageIcon className="w-4 h-4" />,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                const url = window.prompt('Enter image URL')
                if (url) {
                    editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
                }
            },
        },
        {
            title: "Table",
            description: "Insert a simple table.",
            icon: <div className="w-4 h-4 flex items-center justify-center font-bold text-xs border rounded">T</div>,
            command: ({ editor, range }: CommandItemProps['command']['arguments']) => {
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            },
        },
    ].filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
    );
};

export const SlashCommand = Extension.create({
    name: "slashCommand",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export const configureSlashCommand = () => {
    return SlashCommand.configure({
        suggestion: {
            items: getSuggestionItems,
            render: renderItems,
        },
    })
}

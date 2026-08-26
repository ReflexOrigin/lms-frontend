"use client";
import { useState } from "react";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, CardHeader, Field, Input, cx, useToast } from "@/components/ui";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
};

let uid = 100;

export default function QuizBuilder() {
  const toast = useToast();
  const [title, setTitle] = useState("Final Assessment");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "q-initial",
      prompt: "What is the primary goal of cross-validation?",
      options: ["To evaluate model performance", "To speed up training", "To reduce dataset size", "To increase bias"],
      correct: 0
    }
  ]);
  const [active, setActive] = useState(questions[0].id);

  const current = questions.find((q) => q.id === active) ?? questions[0];

  const update = (patch: Partial<QuizQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === current.id ? { ...q, ...patch } : q)));

  const updateOption = (i: number, val: string) => {
    const opts = [...current.options];
    opts[i] = val;
    update({ options: opts });
  };

  const addQuestion = () => {
    const q: QuizQuestion = {
      id: `q-${uid++}`,
      prompt: "New question",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
    };
    setQuestions((qs) => [...qs, q]);
    setActive(q.id);
  };

  const duplicate = () => {
    const q = { ...current, id: `q-${uid++}`, prompt: current.prompt + " (copy)" };
    setQuestions((qs) => [...qs, q]);
    setActive(q.id);
    toast("Question duplicated", "info");
  };

  const remove = (id: string) => {
    if (questions.length === 1) return;
    const idx = questions.findIndex((q) => q.id === id);
    const next = questions.filter((q) => q.id !== id);
    setQuestions(next);
    if (id === active) setActive(next[Math.max(0, idx - 1)].id);
  };

  return (
    <Page
      title="Quiz Builder"
      subtitle="ML Fundamentals · Assessment"
      actions={
        <>
          <Button variant="outline" onClick={() => toast("Quiz saved", "info")}>
            Save quiz
          </Button>
          <Button onClick={() => toast("Quiz published")}>Publish quiz</Button>
        </>
      }
    >
      <Card className="mb-4 p-5">
        <Field label="Quiz title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-md" />
        </Field>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Question list */}
        <Card className="h-fit">
          <CardHeader title="Questions" subtitle={`${questions.length} total`} action={<Button size="sm" onClick={addQuestion}><Plus size={14} /> Add</Button>} />
          <div className="p-3 space-y-1.5">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setActive(q.id)}
                className={cx(
                  "w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition",
                  q.id === active ? "accent-soft-bg" : "hover:bg-muted",
                )}
              >
                <GripVertical size={14} className="text-muted-foreground/40" />
                <span className="w-6 h-6 rounded-md accent-bg text-white text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                <span className={cx("text-sm truncate flex-1", q.id === active && "accent-text font-medium")}>{q.prompt}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Question editor */}
        <Card className="lg:col-span-2 h-fit">
          <CardHeader
            title={`Question ${questions.findIndex((q) => q.id === active) + 1}`}
            action={
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={duplicate}>
                  <Copy size={14} /> Duplicate
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(current.id)} className="!text-[var(--color-danger)]">
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            }
          />
          <div className="p-5 space-y-5">
            <Field label="Question prompt">
              <Input value={current.prompt} onChange={(e) => update({ prompt: e.target.value })} />
            </Field>
            <div>
              <span className="block text-[13px] font-medium mb-2">Answer options</span>
              <p className="text-xs text-muted-foreground mb-3">Select the radio to mark the correct answer.</p>
              <div className="space-y-2.5">
                {current.options.map((opt, i) => {
                  const correct = current.correct === i;
                  return (
                    <div
                      key={i}
                      className={cx(
                        "flex items-center gap-3 p-2 pl-3 rounded-xl border transition",
                        correct ? "border-[var(--color-success)] bg-[var(--color-success-soft)]/40" : "border-border",
                      )}
                    >
                      <button
                        onClick={() => update({ correct: i })}
                        className={cx(
                          "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                          correct ? "border-[var(--color-success)]" : "border-border",
                        )}
                      >
                        {correct && <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" />}
                      </button>
                      <span className="text-sm font-medium text-muted-foreground w-5">{String.fromCharCode(65 + i)}</span>
                      <input
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                      {correct && <span className="text-xs font-medium text-[var(--color-success)]">Correct</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}


"use client";
import { useState } from "react";
import { Eye, PlayCircle } from "lucide-react";
import { Page } from "@/components/Page";
import { Button, Card, CardHeader, Field, Input, Select, Textarea, useToast } from "@/components/ui";

export default function LessonEditor() {
  const toast = useToast();
  const [title, setTitle] = useState("Model Evaluation");
  const [body, setBody] = useState(
    "Cross-validation gives us an honest estimate of how a model will perform on unseen data. Rather than trusting a single train/test split, we rotate through folds so every observation is used for both training and validation.\n\nThe bias-variance tradeoff frames the tension: simple models underfit (high bias), while overly flexible models overfit (high variance). Our job is to find the sweet spot.",
  );
  const [video, setVideo] = useState("https://videos.praxis.edu/ml-eval-intro");

  return (
    <Page
      title="Lesson Editor"
      subtitle="ML Fundamentals · Lesson 05"
      actions={
        <>
          <Button variant="outline" onClick={() => toast("Draft saved", "info")}>
            Save draft
          </Button>
          <Button onClick={() => toast("Lesson published")}>Publish</Button>
        </>
      }
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Editor */}
        <Card className="h-fit">
          <CardHeader title="Content" />
          <div className="p-5 space-y-4">
            <Field label="Lesson title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Lesson description">
              <Input defaultValue="Estimating generalization performance the honest way." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Lesson order">
                <Input type="number" defaultValue={5} />
              </Field>
              <Field label="Type">
                <Select defaultValue="video">
                  <option value="video">Video + reading</option>
                  <option value="reading">Reading only</option>
                </Select>
              </Field>
            </div>
            <Field label="Video URL">
              <Input value={video} onChange={(e) => setVideo(e.target.value)} />
            </Field>
            <Field label="Text content" hint="Markdown supported. Preview updates live.">
              <Textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40 text-xs text-muted-foreground">
              <Eye size={14} /> Live preview
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold tracking-tight">{title || "Untitled lesson"}</h2>
              {video && (
                <div className="mt-4 aspect-video rounded-xl bg-foreground/90 flex items-center justify-center text-white/80">
                  <PlayCircle size={44} strokeWidth={1.2} />
                </div>
              )}
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90">
                {body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}


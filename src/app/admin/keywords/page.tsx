"use client";

import * as React from "react";
import { toast } from "sonner";

import { ClientOnly } from "@/components/common/ClientOnly";
import { addKeyword, deleteKeyword, updateKeyword } from "@/lib/demoActions";
import { loadDb } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminKeywordsPage() {
  return (
    <ClientOnly fallback={<div className="text-sm text-[color:var(--muted)]">로딩 중…</div>}>
      <AdminKeywordsInner />
    </ClientOnly>
  );
}

function AdminKeywordsInner() {
  const [tick, setTick] = React.useState(0);
  void tick;
  const db = loadDb();
  const keywords = db.keywords;

  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");

  function refresh() {
    setTick((x) => x + 1);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-2xl font-semibold">키워드 관리</div>
        <div className="text-sm text-[color:var(--muted)]">
          추가/수정/삭제가 프로필/검색에 즉시 반영됩니다.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>키워드 목록</span>
            <Badge variant="outline">{keywords.length}개</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="새 키워드 입력"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button
              className="sm:w-40"
              onClick={() => {
                const res = addKeyword(newName);
                if (!res.ok) {
                  toast.error(res.error);
                  return;
                }
                toast.success("키워드 추가 완료");
                setNewName("");
                refresh();
              }}
            >
              추가
            </Button>
          </div>

          <div className="grid gap-2">
            {keywords.map((k) => {
              const isEditing = editingId === k.id;
              return (
                <div
                  key={k.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-[color:var(--muted-2)]">ID: {k.id}</div>
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      <div className="text-sm font-semibold truncate">{k.name}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            const res = updateKeyword({ id: k.id, name: editingName });
                            if (!res.ok) {
                              toast.error(res.error);
                              return;
                            }
                            toast.success("키워드 수정 완료");
                            setEditingId(null);
                            setEditingName("");
                            refresh();
                          }}
                        >
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                          }}
                        >
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingId(k.id);
                            setEditingName(k.name);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            if (!confirm("키워드를 삭제할까요?")) return;
                            deleteKeyword(k.id);
                            toast.success("키워드 삭제 완료");
                            refresh();
                          }}
                        >
                          삭제
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



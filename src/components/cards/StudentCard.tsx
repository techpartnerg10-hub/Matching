"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Profile, User } from "@/lib/demoDbTypes";
import type { DemoDb } from "@/lib/demoDbTypes";
import { getKeywordName } from "@/lib/demoActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StudentCard({
  db,
  user,
  profile,
  matchKeywordIds,
  selectedKeywordIds,
}: {
  db: DemoDb;
  user: User;
  profile: Profile;
  matchKeywordIds: string[];
  selectedKeywordIds: string[];
}) {
  const matchNames = matchKeywordIds.map((id) => getKeywordName(db, id));
  const rest = profile.keywords.filter((k) => !matchKeywordIds.includes(k)).slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{user.name}</span>
          {matchNames.length > 0 && <Badge variant="green">매칭 {matchNames.length}</Badge>}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {profile.intro?.trim() ? profile.intro : "소개가 비어있습니다."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {matchNames.slice(0, 6).map((name) => (
            <Badge key={name} variant="brand">
              {name}
            </Badge>
          ))}
          {rest.map((id) => (
            <Badge key={id} variant="outline">
              {getKeywordName(db, id)}
            </Badge>
          ))}
        </div>

        <Link
          href={`/company/match-requests/new?studentId=${encodeURIComponent(
            user.id,
          )}&keywords=${encodeURIComponent(selectedKeywordIds.join(","))}`}
        >
          <Button className="w-full">
            학생 선택 · 매칭 요청 <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}



"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { DemoDb, Profile, User } from "@/lib/demoDbTypes";
import { getKeywordName } from "@/lib/demoActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CompanyCard({
  db,
  user,
  profile,
}: {
  db: DemoDb;
  user: User;
  profile: Profile;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{user.name}</span>
          <Badge variant="outline">기업</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {profile.intro?.trim() ? profile.intro : "기업 소개가 비어있습니다."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {profile.keywords.slice(0, 8).map((id) => (
            <Badge key={id} variant="brand">
              {getKeywordName(db, id)}
            </Badge>
          ))}
          {profile.keywords.length === 0 && (
            <div className="text-sm text-[color:var(--muted-2)]">
              키워드가 없습니다.
            </div>
          )}
        </div>
        <Link href={`/student/companies/${encodeURIComponent(user.id)}`}>
          <Button className="w-full" variant="secondary">
            기업 정보 보기 <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}



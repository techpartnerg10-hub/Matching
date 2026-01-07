import type { DemoDb } from "@/lib/demoDbTypes";

function isoNowMinusDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const SEED_DB: DemoDb = {
  schemaVersion: 1,
  users: [
    // Admin
    {
      id: "u_admin_1",
      role: "admin",
      email: "admin@demo.com",
      name: "관리자(데모)",
      password: "demo1234",
      createdAt: isoNowMinusDays(20),
      status: "active",
    },
    // Companies
    {
      id: "u_c_1",
      role: "company",
      email: "company1@demo.com",
      name: "네오랩스",
      password: "demo1234",
      createdAt: isoNowMinusDays(18),
      status: "active",
    },
    {
      id: "u_c_2",
      role: "company",
      email: "company2@demo.com",
      name: "오로라스튜디오",
      password: "demo1234",
      createdAt: isoNowMinusDays(17),
      status: "active",
    },
    {
      id: "u_c_3",
      role: "company",
      email: "company3@demo.com",
      name: "파인데이터",
      password: "demo1234",
      createdAt: isoNowMinusDays(16),
      status: "active",
    },
    {
      id: "u_c_4",
      role: "company",
      email: "company4@demo.com",
      name: "브릿지커머스",
      password: "demo1234",
      createdAt: isoNowMinusDays(15),
      status: "active",
    },
    {
      id: "u_c_5",
      role: "company",
      email: "company5@demo.com",
      name: "그로스마켓",
      password: "demo1234",
      createdAt: isoNowMinusDays(14),
      status: "active",
    },
    // Students
    {
      id: "u_s_1",
      role: "student",
      email: "student1@demo.com",
      name: "김하린",
      password: "demo1234",
      createdAt: isoNowMinusDays(12),
      status: "active",
    },
    {
      id: "u_s_2",
      role: "student",
      email: "student2@demo.com",
      name: "이준호",
      password: "demo1234",
      createdAt: isoNowMinusDays(11),
      status: "active",
    },
    {
      id: "u_s_3",
      role: "student",
      email: "student3@demo.com",
      name: "박서연",
      password: "demo1234",
      createdAt: isoNowMinusDays(10),
      status: "active",
    },
    {
      id: "u_s_4",
      role: "student",
      email: "student4@demo.com",
      name: "최민재",
      password: "demo1234",
      createdAt: isoNowMinusDays(9),
      status: "active",
    },
    {
      id: "u_s_5",
      role: "student",
      email: "student5@demo.com",
      name: "정예린",
      password: "demo1234",
      createdAt: isoNowMinusDays(8),
      status: "active",
    },
    {
      id: "u_s_6",
      role: "student",
      email: "student6@demo.com",
      name: "한도윤",
      password: "demo1234",
      createdAt: isoNowMinusDays(7),
      status: "active",
    },
    {
      id: "u_s_7",
      role: "student",
      email: "student7@demo.com",
      name: "오지후",
      password: "demo1234",
      createdAt: isoNowMinusDays(6),
      status: "active",
    },
    {
      id: "u_s_8",
      role: "student",
      email: "student8@demo.com",
      name: "윤수빈",
      password: "demo1234",
      createdAt: isoNowMinusDays(5),
      status: "active",
    },
  ],
  keywords: [
    { id: "k_frontend", name: "프론트엔드" },
    { id: "k_backend", name: "백엔드" },
    { id: "k_fullstack", name: "풀스택" },
    { id: "k_mobile", name: "모바일" },
    { id: "k_uiux", name: "UI/UX" },
    { id: "k_design", name: "디자인" },
    { id: "k_product", name: "프로덕트" },
    { id: "k_pm", name: "기획/PM" },
    { id: "k_data", name: "데이터" },
    { id: "k_ai", name: "AI" },
    { id: "k_python", name: "Python" },
    { id: "k_security", name: "보안" },
    { id: "k_cloud", name: "클라우드" },
    { id: "k_devops", name: "DevOps" },
    { id: "k_marketing", name: "마케팅" },
    { id: "k_sales", name: "영업" },
    { id: "k_content", name: "콘텐츠" },
    { id: "k_branding", name: "브랜딩" },
    { id: "k_game", name: "게임" },
    { id: "k_fintech", name: "핀테크" },
    { id: "k_ecommerce", name: "이커머스" },
  ],
  profiles: [
    // Company profiles (기업 소개/키워드)
    {
      userId: "u_c_1",
      keywords: ["k_ai", "k_backend", "k_cloud"],
      intro:
        "AI 기반 B2B SaaS를 개발합니다. Node/Cloud 환경에서 빠르게 실험하고 확장합니다.",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=neo",
      updatedAt: isoNowMinusDays(3),
    },
    {
      userId: "u_c_2",
      keywords: ["k_uiux", "k_design", "k_branding"],
      intro:
        "브랜드 경험을 설계하는 스튜디오입니다. 제품/서비스의 전환을 디자인으로 끌어올립니다.",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=aurora",
      updatedAt: isoNowMinusDays(4),
    },
    {
      userId: "u_c_3",
      keywords: ["k_data", "k_ai", "k_devops"],
      intro:
        "데이터 파이프라인과 분석 플랫폼을 만듭니다. MLOps/관측성에 강점이 있습니다.",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=pinedata",
      updatedAt: isoNowMinusDays(2),
    },
    {
      userId: "u_c_4",
      keywords: ["k_ecommerce", "k_fullstack", "k_product"],
      intro:
        "커머스 운영 자동화 제품을 만들고 있습니다. 고객 경험과 운영 효율을 동시에 개선합니다.",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=bridge",
      updatedAt: isoNowMinusDays(2),
    },
    {
      userId: "u_c_5",
      keywords: ["k_marketing", "k_content", "k_product"],
      intro:
        "그로스 마케팅과 콘텐츠를 제품처럼 운영합니다. 실험-분석-개선 루프가 강점입니다.",
      avatarUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=growth",
      updatedAt: isoNowMinusDays(1),
    },

    // Student profiles (학생 키워드/소개)
    {
      userId: "u_s_1",
      keywords: ["k_frontend", "k_uiux", "k_product"],
      intro:
        "React/Next 기반 UI를 좋아합니다. 사용성 지표를 보고 개선하는 걸 즐깁니다.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=harin",
      updatedAt: isoNowMinusDays(1),
    },
    {
      userId: "u_s_2",
      keywords: ["k_backend", "k_cloud", "k_devops"],
      intro:
        "API 설계와 배포 자동화에 관심이 많습니다. 로그/모니터링까지 챙깁니다.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=junho",
      updatedAt: isoNowMinusDays(2),
    },
    {
      userId: "u_s_3",
      keywords: ["k_design", "k_uiux", "k_branding"],
      intro:
        "브랜딩과 제품 UX를 함께 고민합니다. 컴포넌트 시스템 설계도 좋아합니다.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=seoyeon",
      updatedAt: isoNowMinusDays(3),
    },
    {
      userId: "u_s_4",
      keywords: ["k_data", "k_ai", "k_python"],
      intro:
        "데이터 분석과 모델링에 관심이 있습니다. 문제 정의부터 리포팅까지 경험했습니다.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=minjae",
      updatedAt: isoNowMinusDays(4),
    },
    {
      userId: "u_s_5",
      keywords: ["k_pm", "k_product", "k_marketing"],
      intro:
        "사용자 문제를 파고드는 PM을 지향합니다. 실험 설계와 커뮤니케이션에 강점이 있습니다.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=yerin",
      updatedAt: isoNowMinusDays(5),
    },
    {
      userId: "u_s_6",
      keywords: ["k_fullstack", "k_ecommerce", "k_frontend"],
      intro:
        "커머스 도메인을 좋아합니다. 프론트부터 간단한 API까지 빠르게 만들 수 있어요.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=doyoon",
      updatedAt: isoNowMinusDays(6),
    },
    {
      userId: "u_s_7",
      keywords: ["k_mobile", "k_uiux", "k_product"],
      intro:
        "모바일 경험을 좋아합니다. 작은 상호작용으로 만족도를 높이는 데 관심이 있어요.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=jihuu",
      updatedAt: isoNowMinusDays(6),
    },
    {
      userId: "u_s_8",
      keywords: ["k_security", "k_backend", "k_cloud"],
      intro:
        "보안 기본기와 백엔드 구현을 함께 챙깁니다. 권한/감사로그 설계에 관심이 있어요.",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=subin",
      updatedAt: isoNowMinusDays(7),
    },
  ],
  matchRequests: [
    {
      id: "mr_1",
      companyId: "u_c_1",
      studentId: "u_s_2",
      keywordsSnapshot: ["k_backend", "k_cloud", "k_devops"],
      message: "백엔드/클라우드 기반으로 프로젝트를 함께 진행해보고 싶습니다.",
      status: "pending",
      createdAt: isoNowMinusDays(1),
    },
    {
      id: "mr_2",
      companyId: "u_c_4",
      studentId: "u_s_6",
      keywordsSnapshot: ["k_ecommerce", "k_fullstack", "k_frontend"],
      message: "커머스 도메인 경험을 살려 빠르게 MVP를 만들어보고 싶습니다.",
      status: "approved",
      createdAt: isoNowMinusDays(2),
    },
  ],
  notificationLogs: [
    {
      id: "nl_1",
      type: "email",
      to: "admin@demo.com",
      subject: "[매칭요청] 네오랩스 → 이준호",
      payload: { matchRequestId: "mr_1" },
      createdAt: isoNowMinusDays(1),
    },
    {
      id: "nl_2",
      type: "admin",
      to: "admin@demo.com",
      subject: "[승인됨] 브릿지커머스 → 한도윤",
      payload: { matchRequestId: "mr_2" },
      createdAt: isoNowMinusDays(2),
    },
  ],
  auditLogs: [
    {
      id: "al_1",
      level: "info",
      message: "SEED_DB 초기화",
      createdAt: isoNowMinusDays(20),
    },
  ],
};



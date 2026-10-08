"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  SimpleGrid,
  Title,
  Container,
  Loader,
  Center,
  Alert,
  Box,
  Stack,
} from "@mantine/core";
import { createClient } from "@base44/sdk";

// --- BASE44 CLIENT SETUP ---
const base44 = createClient({
  appId: "6ac73942c980e55d9137380b",
  headers: {
    Authorization: "Bearer YOUR_PERSONAL_ACCESS_TOKEN", // ← Yahan apna token daalein
  },
});

// --- PREMIUM VINTAGE STYLES ---
const NEWSPAPER_BG = "#f2efe9"; // Warm paper color
const INK_COLOR = "#111111"; // Deep black ink
const FONT_SERIF = "'Times New Roman', Times, serif";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API CALL ---
  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        // Base44 API Call
        const records = await base44.entities.News.list();

        // Ensure data is an array
        setNews(Array.isArray(records) ? records : []);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(
          err?.message || "Failed to load news. Please check your API token."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Center h="100vh" bg={NEWSPAPER_BG}>
        <Box ta="center">
          <Loader size="xl" color="dark" />
          <Text
            mt="md"
            style={{ fontFamily: FONT_SERIF, color: INK_COLOR, fontWeight: 700 }}
          >
            PRINTING PRESS RUNNING...
          </Text>
        </Box>
      </Center>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <Container size="sm" py={60} bg={NEWSPAPER_BG}>
        <Alert color="red" title="Printing Error" variant="filled">
          {error}
        </Alert>
        <Button
          mt="lg"
          variant="outline"
          color="dark"
          onClick={() => window.location.reload()}
          style={{ fontFamily: FONT_SERIF }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  // ==========================================
  // ========== NEWSPAPER DETAIL VIEW =========
  // ==========================================
  if (selectedNews) {
    const item = selectedNews;

    const title = item.title || item.name || item.headline || "Untitled";
    const description =
      item.description || item.content || item.summary || item.body || "";
    const image =
      item.image ||
      item.image_url ||
      item.cover_image ||
      item.thumbnail ||
      null;
    const date =
      item.created_date ||
      item.createdAt ||
      item.published_at ||
      item.date ||
      new Date().toISOString();

    const formattedDate = new Date(date)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();

    // Description ko 2 parts me divide karo (Left + Right)
    const mid = Math.ceil(description.length / 2);
    const leftText = description.slice(0, mid);
    const rightText = description.slice(mid);

    return (
      <Box
        style={{
          minHeight: "100vh",
          background: "#e0ddd5",
          padding: "20px 10px",
          fontFamily: FONT_SERIF,
        }}
      >
        <Container size="md" px={{ base: 0, sm: "xs" }}>
          {/* Back Button */}
          <Button
            variant="subtle"
            color="dark"
            mb="md"
            onClick={() => setSelectedNews(null)}
            styles={{
              root: { fontFamily: FONT_SERIF, color: INK_COLOR, fontWeight: 700 },
            }}
          >
            ← Back to Archive
          </Button>

          {/* --- NEWSPAPER SHEET START --- */}
          <Box
            p={{ base: 20, sm: 40, md: 50 }}
            style={{
              background: NEWSPAPER_BG,
              backgroundImage: `radial-gradient(#dcdcdc 0.5px, transparent 0.5px), radial-gradient(#dcdcdc 0.5px, #f2efe9 0.5px)`,
              backgroundSize: `20px 20px`,
              backgroundPosition: `0 0, 10px 10px`,
              border: `1px solid #c0c0c0`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              maxWidth: 900,
              margin: "0 auto",
              color: INK_COLOR,
              position: "relative",
            }}
          >
            {/* 1. TOP DECORATIVE LINES */}
            <Box style={{ borderTop: `6px solid ${INK_COLOR}`, marginBottom: 2 }} />
            <Box style={{ borderTop: `2px solid ${INK_COLOR}`, marginBottom: 15 }} />

            {/* 2. MASTHEAD (THE SOCIETY) */}
            <Text
              ta="center"
              style={{
                fontSize: "clamp(38px, 9vw, 95px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                lineHeight: 0.9,
                color: INK_COLOR,
                fontFamily: FONT_SERIF,
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              THE SOCIETY
            </Text>

            {/* 3. INFO BAR */}
            <Group
              justify="space-between"
              mb="lg"
              gap="xs"
              style={{
                borderTop: `2px solid ${INK_COLOR}`,
                borderBottom: `1px solid ${INK_COLOR}`,
                padding: "8px 0",
                fontSize: 11,
                letterSpacing: 1,
                color: INK_COLOR,
                textTransform: "uppercase",
                fontWeight: 700,
                fontFamily: FONT_SERIF,
              }}
            >
              <Text size="xs" fw={700}>VOL. 19, NO.190</Text>
              <Text size="xs" fw={700}>★ REALLYGREATSITE.COM ★</Text>
              <Text size="xs" fw={700}>{formattedDate}</Text>
            </Group>

            {/* 4. BREAKING NEWS HEADER */}
            <Box style={{ borderBottom: `2px solid ${INK_COLOR}`, paddingBottom: 8, marginBottom: 24 }}>
              <Text
                ta="center"
                style={{
                  fontSize: "clamp(24px, 5vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: INK_COLOR,
                  fontFamily: FONT_SERIF,
                  textTransform: "uppercase",
                }}
              >
                Breaking News
              </Text>
            </Box>

            {/* --- 5. MAIN CONTENT RESPONSIVE GRID --- */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: "xl", md: 40 }} >
              {/* LEFT COLUMN */}
              <Box>
                {/* Main Headline */}
                <Text
                  style={{
                    fontSize: "clamp(22px, 4vw, 36px)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: INK_COLOR,
                    fontFamily: FONT_SERIF,
                    marginBottom: 20,
                    textTransform: "uppercase",
                    textAlign: "left",
                  }}
                >
                  {title}
                </Text>

                {/* Article Body */}
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "#222",
                    textAlign: "justify",
                    fontFamily: FONT_SERIF,
                  }}
                >
                  {leftText || description}
                </Text>
              </Box>

              {/* RIGHT COLUMN */}
              <Stack gap="lg">
                {image && (
                  <Box>
                    <Image
                      src={image}
                      alt={title}
                      radius={0}
                      style={{
                        width: "100%",
                        border: `1px solid ${INK_COLOR}`,
                        filter: "grayscale(100%) contrast(1.2) brightness(0.95)",
                        boxShadow: "4px 4px 0px rgba(0,0,0,0.1)",
                      }}
                    />
                    {rightText && (
                      <Text
                        mt={10}
                        style={{
                          fontSize: 12,
                          lineHeight: 1.5,
                          color: "#333",
                          fontFamily: FONT_SERIF,
                          textAlign: "justify",
                          fontStyle: "italic",
                          borderBottom: `1px solid #ccc`,
                          paddingBottom: 15,
                        }}
                      >
                        {rightText.slice(0, 200)}...
                      </Text>
                    )}
                  </Box>
                )}

                {/* Quote Box */}
                <Box
                  style={{
                    border: `3px double ${INK_COLOR}`,
                    padding: "16px",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: INK_COLOR,
                      fontFamily: FONT_SERIF,
                      textAlign: "center",
                      textTransform: "uppercase",
                      lineHeight: 1.4,
                    }}
                  >
                    &quot;SOCIETY&apos;S ESSENCE,
                    <br />
                    REFLECTED IN UNITY.&quot;
                  </Text>
                </Box>
              </Stack>
            </SimpleGrid>

            {/* BOTTOM DECORATIVE LINES */}
            <Box style={{ borderTop: `2px solid ${INK_COLOR}`, marginTop: 40 }} />
            <Box style={{ borderTop: `6px solid ${INK_COLOR}`, marginTop: 3 }} />
          </Box>
          {/* --- NEWSPAPER SHEET END --- */}
        </Container>
      </Box>
    );
  }

  // ==========================================
  // ========== LIST VIEW (Cards) =============
  // ==========================================
  return (
    <Container size="lg" py={{ base: 30, sm: 60 }} bg={NEWSPAPER_BG} style={{ minHeight: "100vh" }}>
      <Box mb={{ base: 30, sm: 50 }} style={{ borderBottom: `4px solid ${INK_COLOR}`, paddingBottom: 10 }}>
        <Title
          order={1}
          ta="center"
          style={{
            fontFamily: FONT_SERIF,
            color: INK_COLOR,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            letterSpacing: "-1px",
          }}
        >
          The Daily Archive
        </Title>
      </Box>

      {news.length === 0 ? (
        <Center h="40vh">
          <Text ta="center" c="dimmed" style={{ fontFamily: FONT_SERIF, fontSize: "1.2rem" }}>
            No news found in the archive.
          </Text>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: "md", sm: "xl" }}>
          {news.map((item, index) => {
            const title = item.title || item.name || item.headline || "Untitled";
            const description =
              item.description ||
              item.content ||
              item.summary ||
              item.body ||
              "No description available.";
            const image =
              item.image ||
              item.image_url ||
              item.cover_image ||
              item.thumbnail ||
              "https://images.unsplash.com/photo-1504711434869-e1ff66873b80?w=400&h=250&fit=crop";
            const badge =
              item.category || item.badge || item.tag || item.type || "News";

            return (
              <Card
                key={item.id || index}
                shadow="sm"
                padding="lg"
                radius="xs"
                withBorder
                style={{
                  background: "#fff",
                  borderColor: "#aaa",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedNews(item)}
              >
                <Card.Section style={{ borderBottom: `1px solid #eee` }}>
                  <Image
                    src={image}
                    height={180}
                    alt={title}
                    style={{ filter: "grayscale(100%) contrast(1.1)" }}
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Badge color="dark" variant="filled" radius="xs" style={{ fontFamily: FONT_SERIF }}>
                    {badge}
                  </Badge>
                  <Text size="xs" c="dimmed" fw={700} style={{ fontFamily: FONT_SERIF }}>
                    {new Date(item.created_date || item.createdAt || Date.now()).toLocaleDateString()}
                  </Text>
                </Group>

                <Text
                  fw={800}
                  lineClamp={2}
                  style={{
                    fontFamily: FONT_SERIF,
                    color: INK_COLOR,
                    fontSize: "1.15rem",
                    lineHeight: 1.25,
                    marginBottom: 8,
                  }}
                >
                  {title}
                </Text>

                <Text size="sm" c="dimmed" lineClamp={3} style={{ fontFamily: FONT_SERIF, lineHeight: 1.5 }}>
                  {description}
                </Text>

                <Button
                  variant="outline"
                  color="dark"
                  radius="xs"
                  fullWidth
                  mt="lg"
                  style={{ fontFamily: FONT_SERIF, borderWidth: 2, fontWeight: 700 }}
                >
                  Read Article
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Container>
  );
}
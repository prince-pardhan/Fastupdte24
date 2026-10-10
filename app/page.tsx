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
  Grid,
  Anchor,
  Divider,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { createClient } from "@base44/sdk";

// ─── Multiple Base44 App Configs ────────────────────────────────────────────
const BASE44_SOURCES = [
  {
    appId: "6ac73942c980e55d9137380b",
    entity: "News",
    label: "Source 1",
  },
  {
    appId: "6ac47ab69017eaaaca59d2b6",
    entity: "NewsArticle",
    label: "Source 2",
  },
  {
    appId: "6ac74166b60dfff87e4daa42",
    entity: "News",
    label: "Source 3",
  },
  {
    appId: "6ac739626c09d4a58a836242",
    entity: "News",
    label: "Source 4",
  },
  {
    appId: "6ac886b5654b5b3de6285403",
    entity: "News",
    label: "Source 5",
  },
  {
    appId: "6ac8879bc192246ca1e81374",
    entity: "News",
    label: "Source 6",
  },
  {
    appId: "6ac88f5d592444cfa59f9489",
    entity: "News",
    label: "Source 7",
  },
];

const PERSONAL_ACCESS_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"; // ← apna token daalo

// Colors
const DARK = "#1a1a1a";
const ACCENT = "#e30613";
const LIGHT_BG = "#f5f5f5";
const FONT = "'Inter', system-ui, -apple-system, sans-serif";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllNews() {
      try {
        setLoading(true);
        setError(null);

        const allResults: any[] = [];

        // Parallel fetch from all sources
        const promises = BASE44_SOURCES.map(async (source) => {
          try {
            const base44 = createClient({
              appId: source.appId,
              headers: {
                Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`,
              },
            });

            const records = await base44.entities[source.entity].list();

            if (Array.isArray(records)) {
              return records.map((r: any) => ({
                ...r,
                _source: source.label,
                _entity: source.entity,
                _appId: source.appId,
              }));
            }
            return [];
          } catch (srcErr: any) {
            console.warn(`Failed to fetch from ${source.label}:`, srcErr?.message);
            return [];
          }
        });

        const results = await Promise.all(promises);
        results.forEach((arr) => allResults.push(...arr));

        // Sort by date (newest first)
        allResults.sort((a, b) => {
          const dateA = new Date(
            a.created_date || a.createdAt || a.published_at || a.date || 0
          ).getTime();
          const dateB = new Date(
            b.created_date || b.createdAt || b.published_at || b.date || 0
          ).getTime();
          return dateB - dateA;
        });

        setNews(allResults);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    }

    fetchAllNews();
  }, []);

  // ---------- helpers ----------
  const getImage = (item: any) =>
    item.image ||
    item.image_url ||
    item.cover_image ||
    item.thumbnail ||
    "https://images.unsplash.com/photo-1504711434869-e1ff66873b80?w=800&h=500&fit=crop";

  const getTitle = (item: any) =>
    item.title || item.name || item.headline || "Untitled";

  const getDesc = (item: any) =>
    item.description ||
    item.content ||
    item.summary ||
    item.body ||
    "No description available.";

  const getDate = (item: any) => {
    const d =
      item.created_date ||
      item.createdAt ||
      item.published_at ||
      item.date ||
      Date.now();
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFullDate = (item: any) => {
    const d =
      item.created_date ||
      item.createdAt ||
      item.published_at ||
      item.date ||
      Date.now();
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getBadge = (item: any) =>
    item.category || item.badge || item.tag || item.type || "News";

  // ---------- LOADING / ERROR ----------
  if (loading) {
    return (
      <Center h="70vh" bg={LIGHT_BG}>
        <Stack align="center" gap="md">
          <Loader size="lg" color={ACCENT} />
          <Text size="sm" c="dimmed">
            Saari sources se news load ho rahi hai...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="sm" py={40}>
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  // ========== NEW MODERN READ MORE / DETAIL VIEW ==========
  if (selectedNews) {
    const item = selectedNews;
    const title = getTitle(item);
    const description = getDesc(item);
    const image = getImage(item);

    return (
      <Box bg={LIGHT_BG} style={{ minHeight: "100vh", fontFamily: FONT }}>
        {/* Top Navigation */}
        <Box bg={DARK} c="white" py="sm" style={{ position: "sticky", top: 0, zIndex: 100 }}>
          <Container size="lg">
            <Group justify="space-between">
              <Group gap="xs">
                <Box
                  style={{
                    width: 28,
                    height: 28,
                    background: ACCENT,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 14,
                  }}
                >
                  F
                </Box>
                <Text fw={800} size="lg">
                  newzfast
                </Text>
              </Group>

              <Button
                variant="light"
                color="gray"
                radius="md"
                size="sm"
                onClick={() => setSelectedNews(null)}
              >
                ← Back to Home
              </Button>
            </Group>
          </Container>
        </Box>

        <Container size="md" py={{ base: 30, md: 50 }}>
          {/* Meta info */}
          <Group gap="sm" mb="md">
            <Badge color="red" size="lg" radius="sm" variant="filled">
              {getBadge(item)}
            </Badge>
            {item._source && (
              <Badge color="dark" size="sm" variant="outline">
                {item._source}
              </Badge>
            )}
            <Text size="sm" c="dimmed" fw={500}>
              {getFullDate(item)}
            </Text>
          </Group>

          {/* Big Title */}
          <Title
            order={1}
            mb="xl"
            style={{
              fontSize: "clamp(1.7rem, 4.5vw, 2.7rem)",
              fontWeight: 800,
              lineHeight: 1.25,
              color: DARK,
            }}
          >
            {title}
          </Title>

          {/* Featured Image */}
          <Box
            mb="xl"
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            }}
          >
            <Image
              src={image}
              alt={title}
              h={{ base: 240, sm: 360, md: 440 }}
              fit="cover"
            />
          </Box>

          {/* Article Content Card */}
          <Box
            bg="white"
            p={{ base: "lg", sm: "xl" }}
            style={{
              borderRadius: 16,
              border: "1px solid #eaeaea",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                lineHeight: 1.85,
                color: "#333",
                whiteSpace: "pre-line",
              }}
            >
              {description}
            </Text>

            <Divider my="xl" color="#eee" />

            <Group justify="space-between" align="center">
              <Box>
                <Text size="sm" c="dimmed">
                  Published on
                </Text>
                <Text size="sm" fw={600}>
                  {getFullDate(item)}
                </Text>
              </Box>

              <Button
                variant="filled"
                color="red"
                radius="md"
                size="md"
                onClick={() => setSelectedNews(null)}
              >
                ← Back to All News
              </Button>
            </Group>
          </Box>

          {/* More News Suggestion */}
          {news.length > 1 && (
            <Box mt={50}>
              <Title order={3} mb="lg" style={{ fontWeight: 700 }}>
                More News
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {news
                  .filter((n) => n.id !== item.id)
                  .slice(0, 4)
                  .map((n) => (
                    <Card
                      key={n.id}
                      padding="sm"
                      radius="md"
                      withBorder
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedNews(n)}
                    >
                      <Group wrap="nowrap" gap="sm">
                        <Image
                          src={getImage(n)}
                          w={70}
                          h={70}
                          radius={8}
                          fit="cover"
                        />
                        <Box>
                          <Text size="sm" fw={600} lineClamp={2}>
                            {getTitle(n)}
                          </Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            {getDate(n)}
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
              </SimpleGrid>
            </Box>
          )}
        </Container>
      </Box>
    );
  }

  // ========== LIST VIEW ==========
  const featured = news[0];
  const latest = news.slice(1, 4);
  const popular = news.slice(4, 7);
  const trending = news.slice(7, 15); // more news in trending

  return (
    <Box bg={LIGHT_BG} style={{ minHeight: "100vh", fontFamily: FONT }}>
      {/* ===== TOP DARK HEADER ===== */}
      <Box bg={DARK} c="white" style={{ position: "relative" }}>
        {/* FREE ribbon */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: 18,
              right: -35,
              background: ACCENT,
              color: "white",
              width: 160,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 1,
              transform: "rotate(45deg)",
              padding: "6px 0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            FREE
          </Box>
        </Box>

        <Container size="xl" py="sm">
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="xs">
              <Box
                style={{
                  width: 32,
                  height: 32,
                  background: ACCENT,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 18,
                }}
              >
                F
              </Box>
              <Text fw={900} size="xl" style={{ letterSpacing: -0.5 }}>
                Newzfast
              </Text>
            </Group>

            <Group gap="lg" visibleFrom="sm">
              {["Home", "Category", "Contact", "About"].map((link) => (
                <Anchor key={link} c="white" size="sm" fw={500} href="#">
                  {link}
                </Anchor>
              ))}
            </Group>

            <Group gap="xs">
              <TextInput
                placeholder="Search..."
                size="xs"
                radius="xl"
                styles={{
                  input: {
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "white",
                    width: 160,
                  },
                }}
                visibleFrom="md"
              />
              <ActionIcon variant="subtle" c="white" size="lg">
                ☰
              </ActionIcon>
            </Group>
          </Group>
        </Container>

        {/* Hero */}
        <Box
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1504711434869-e1ff66873b80?w=1400&h=400&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "48px 0 56px",
            textAlign: "center",
          }}
        >
          <Container size="md">
            <Title
              order={1}
              style={{
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                fontWeight: 900,
                letterSpacing: -1,
                color: "white",
              }}
            >
              Newzfast 
            </Title>
            <Text c="gray.3" mt={8} size="sm">
              {news.length} news loaded from multiple sources
            </Text>
          </Container>
        </Box>
      </Box>

      {/* ===== MAIN CONTENT ===== */}
      <Container size="xl" py={{ base: 24, md: 40 }}>
        <Grid>
          {/* LEFT – Latest */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Box
              bg="white"
              p="md"
              style={{ borderRadius: 8, border: "1px solid #eaeaea", height: "100%" }}
            >
              <Group justify="space-between" mb="md">
                <Title order={4} style={{ fontSize: 16, fontWeight: 700, color: "black" }}>
                  Latest
                </Title>
                <Box w={8} h={8} bg="green" style={{ borderRadius: "50%" }} />
              </Group>

              <Stack gap="md">
                {(latest.length ? latest : news.slice(0, 3)).map((item, i) => (
                  <Box
                    key={item.id || i}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedNews(item)}
                  >
                    <Group align="flex-start" gap="sm" wrap="nowrap">
                      <Image
                        src={getImage(item)}
                        w={56}
                        h={56}
                        radius={4}
                        fit="cover"
                        style={{ flexShrink: 0 }}
                      />
                      <Box>
                        <Text size="sm" fw={600} lineClamp={2} style={{ lineHeight: 1.3, color: "black" }}>
                          {getTitle(item)}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          {getDate(item)}
                        </Text>
                      </Box>
                    </Group>
                    {i < 2 && <Divider mt="md" color="#f0f0f0" />}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid.Col>

          {/* CENTER – Main Events */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box
              bg="white"
              p="md"
              style={{ borderRadius: 8, border: "1px solid #eaeaea", height: "100%" }}
            >
              <Title order={4} mb="md" style={{ fontSize: 16, fontWeight: 700, color: "black" }}>
                Main Events
              </Title>

              {featured && (
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedNews(featured)}
                >
                  <Box style={{ position: "relative", marginBottom: 16 }}>
                    <Image
                      src={getImage(featured)}
                      h={{ base: 220, sm: 280 }}
                      radius={6}
                      fit="cover"
                    />
                    <Badge
                      color="red"
                      size="sm"
                      style={{ position: "absolute", top: 12, left: 12 }}
                    >
                      Featured
                    </Badge>
                  </Box>

                  <Text
                    fw={700}
                    style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", lineHeight: 1.3, color: "black" }}
                    mb={8}
                    lineClamp={2}
                  >
                    {getTitle(featured)}
                  </Text>

                  <Text size="sm" c="dimmed" lineClamp={2} mb={8}>
                    {getDesc(featured)}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {getDate(featured)}
                  </Text>
                </Box>
              )}
            </Box>
          </Grid.Col>

          {/* RIGHT – Popular */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Box
              bg="white"
              p="md"
              style={{ borderRadius: 8, border: "1px solid #eaeaea", height: "100%" }}
            >
              <Group justify="space-between" mb="md">
                <Title order={4} style={{ fontSize: 16, fontWeight: 700, color: "black" }}>
                  Popular
                </Title>
                <Box w={8} h={8} bg="orange" style={{ borderRadius: "50%" }} />
              </Group>

              <Stack gap="md">
                {(popular.length ? popular : news.slice(3, 6)).map((item, i) => (
                  <Box
                    key={item.id || i}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedNews(item)}
                  >
                    <Group align="flex-start" gap="sm" wrap="nowrap">
                      <Image
                        src={getImage(item)}
                        w={56}
                        h={56}
                        radius={4}
                        fit="cover"
                        style={{ flexShrink: 0 }}
                      />
                      <Box>
                        <Text size="sm" fw={600} lineClamp={2} style={{ lineHeight: 1.3, color: "black" }}>
                          {getTitle(item)}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          {getDate(item)}
                        </Text>
                      </Box>
                    </Group>
                    {i < 2 && <Divider mt="md" color="#f0f0f0" />}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid.Col>
        </Grid>

        {/* ===== ALL NEWS / TRENDING GRID ===== */}
        <Box mt={{ base: 40, md: 56 }}>
          <Title
            order={3}
            ta="center"
            mb="xl"
            style={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "black",
            }}
          >
            — ALL NEWS —
          </Title>

          <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="lg">
            {news.map((item, idx) => (
              <Card
                key={item.id || idx}
                padding={0}
                radius="md"
                withBorder
                style={{
                  borderColor: "#eaeaea",
                  cursor: "pointer",
                  overflow: "hidden",
                  background: "white",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onClick={() => setSelectedNews(item)}
              >
                <Card.Section>
                  <Image src={getImage(item)} h={160} fit="cover" />
                </Card.Section>

                <Box p="md">
                  <Group gap="xs" mb={8}>
                    <Badge size="xs" variant="light" color="gray">
                      {getBadge(item)}
                    </Badge>
                    {item._source && (
                      <Badge size="xs" variant="outline" color="red">
                        {item._source}
                      </Badge>
                    )}
                  </Group>

                  <Text fw={600} size="sm" lineClamp={2} style={{ lineHeight: 1.35, color: "black" }}>
                    {getTitle(item)}
                  </Text>

                  <Text size="xs" c="dimmed" mt={6}>
                    {getDate(item)}
                  </Text>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
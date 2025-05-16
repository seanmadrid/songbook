/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { ScaleLoader } from "react-spinners";
import { FaMusic, FaCalendarAlt } from "react-icons/fa";
import { FaMasksTheater } from "react-icons/fa6";
import * as Styled from "./styles";

// Helper to check if song data is valid
const isValidSongs = (songs: any[][]) =>
  Array.isArray(songs) &&
  songs.length > 0 &&
  Array.isArray(songs[0]) &&
  songs[0].filter((cell: any) => !!cell && cell.toString().trim() !== "").length > 0;

// Helper to get column index by header name
const getColumnIndex = (headers: string[], name: string) =>
  headers.findIndex(
    (header) => header?.toLowerCase().trim() === name.toLowerCase()
  );

// Helper to render a table
const SongTable = ({
  songs,
  rowBg,
}: {
  songs: any[][];
  rowBg: (rowIndex: number) => string;
}) => {
  if (!songs.length) return null;
  const headerRow = songs[0];
  return (
    <Table variant="simple" margin="0" padding="0">
      <Thead>
        <Tr>
          {headerRow.map((header: string, index: number) => (
            <Th
              key={index}
              fontFamily='"Ojuju", serif'
              textTransform="capitalize"
              fontSize="xl"
              color="var(--foreground)"
            >
              {header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {songs.slice(1).map((row: any[], rowIndex: number) => (
          <Tr key={rowIndex} bg={rowBg(rowIndex)}>
            {row.map((cell: any, cellIndex: number) => (
              <Td key={cellIndex}>{cell !== "" ? cell : "\u00A0"}</Td>
            ))}
            {/* Fill missing cells if row is short */}
            {Array(headerRow.length - row.length)
              .fill(null)
              .map((_, cellIndex) => (
                <Td key={row.length + cellIndex}>&nbsp;</Td>
              ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const Songbook = () => {
  const sheetId = "1p2lMjRkTJEAViXVPf6rWu4_a8uX8JpmRvGti5hdEDnA";
  const apiKey = "AIzaSyA3L11SNodU2AV_au51wXzH6adYE-RgRTA";
  const sheetName = "Raw Songbook Data";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

  const [songs, setSongs] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data?.values) && data.values.length > 0) {
        setSongs(data.values);
      } else {
        setSongs([]); // Ensures isValidSongs will return false
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setSongs([]); // Ensures isValidSongs will return false
      setLoading(false);
    });
}, []);

  // Memoize processed data for performance and clarity
  const { songsByTitle, songsByYear, songsByShow } = useMemo(() => {
    if (!isValidSongs(songs)) {
      return { songsByTitle: [], songsByYear: [], songsByShow: [] };
    }
    const headers = songs[0];
    const titleIndex = getColumnIndex(headers, "title");
    const yearIndex = getColumnIndex(headers, "year");
    const showIndex = getColumnIndex(headers, "show");

    // Sort helpers
    const sortRows = (
      idx: number,
      transform: (val: string) => string = (v) => v
    ) =>
      songs
        .slice(1)
        .filter((row) => row[idx]?.toString().trim() !== "")
        .sort((a, b) => {
          const aVal = transform(a[idx]?.toString().trim() || "");
          const bVal = transform(b[idx]?.toString().trim() || "");
          if (aVal === "" && bVal === "") return 0;
          if (aVal === "") return 1;
          if (bVal === "") return -1;
          return aVal.localeCompare(bVal);
        });

    const songsByTitle =
      titleIndex !== -1
        ? [headers, ...sortRows(titleIndex, (v) => v.toLowerCase())]
        : songs;

    const songsByYear =
      yearIndex !== -1
        ? [headers, ...sortRows(yearIndex)]
        : songs;

    const songsByShow =
      showIndex !== -1
        ? [headers, ...sortRows(showIndex, (v) => v.toLowerCase())]
        : songs;

    return { songsByTitle, songsByYear, songsByShow };
  }, [songs]);

  const selectedTabStyle = {
    bg: "var(--foreground)",
    color: "var(--background)",
    opacity: 1,
  };

  if (loading) {
    return (
      <VStack
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        gap="24px"
      >
        <ScaleLoader
          color="var(--foreground)"
          width="25"
          height="65"
          speedMultiplier={0.6666}
        />
        <Text
          fontFamily='"Ojuju", serif'
          color="var(--foreground)"
          fontWeight="bold"
          fontSize="24px"
        >
          Loading...
        </Text>
      </VStack>
    );
  }

  if (!isValidSongs(songs)) {
    return (
      <VStack
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        gap="24px"
      >
        <Text
          fontFamily='"Ojuju", serif'
          color="var(--foreground)"
          fontWeight="bold"
          fontSize="24px"
        >
          No song data found.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack bg="var(--background)">
      <Tabs w="100%" variant="soft-rounded">
        <TabList bg="var(--background-alt)" p="16px" flexWrap="wrap" gap="8px">
          <Styled.Tab _selected={selectedTabStyle}>
            <Icon as={FaMusic} /> Title
          </Styled.Tab>
          <Styled.Tab _selected={selectedTabStyle}>
            <Icon as={FaCalendarAlt} />
            Year
          </Styled.Tab>
          <Styled.Tab _selected={selectedTabStyle}>
            <Icon as={FaMasksTheater} />
            Show
          </Styled.Tab>
        </TabList>
        <TabPanels overflowX="auto">
          <TabPanel padding="0">
            <SongTable
              songs={songsByTitle}
              rowBg={(i) =>
                i % 2 === 0
                  ? "var(--background-alt)"
                  : "var(--background)"
              }
            />
          </TabPanel>
          <TabPanel padding="0">
            <SongTable
              songs={songsByYear}
              rowBg={(i) =>
                i % 2 === 0
                  ? "var(--background-alt)"
                  : "var(--background)"
              }
            />
          </TabPanel>
          <TabPanel padding="0">
            <SongTable
              songs={songsByShow}
              rowBg={(i) =>
                i % 2 === 0
                  ? "var(--background-alt)"
                  : "var(--background)"
              }
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
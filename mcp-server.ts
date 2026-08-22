import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { skills, marqueeItems, stats } from "./src/data/skills.js";
import { experience } from "./src/data/experience.js";
import { projects } from "./src/data/projects.js";
import { services } from "./src/data/services.js";

// Create MCP Server
const server = new McpServer({
  name: "portfolio-mcp-server",
  version: "1.0.0",
});

// Tool: Get Skills & Stats
server.tool(
  "get_skills",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ skills, marqueeItems, stats }, null, 2),
        },
      ],
    };
  }
);

// Tool: Get Experience
server.tool(
  "get_experiences",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(experience, null, 2),
        },
      ],
    };
  }
);

// Tool: Get Services
server.tool(
  "get_services",
  {},
  async () => {
    // We sanitize services to avoid serializing React component / lucide icon functions
    const sanitizedServices = services.map(s => ({
      title: s.title,
      description: s.description,
      price: s.price
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(sanitizedServices, null, 2),
        },
      ],
    };
  }
);

// Tool: Get Projects (optional slug or category filter)
server.tool(
  "get_projects",
  {
    slug: z.string().optional().describe("Filter by project slug (e.g., 'aeron')"),
    category: z.string().optional().describe("Filter by project category (e.g., 'E-Commerce')"),
  },
  async ({ slug, category }) => {
    let result = projects;
    if (slug) {
      result = result.filter(p => p.slug === slug);
    }
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Start Server using Stdio Transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Portfolio MCP server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});

import prismaClient from "../config/dbConfig.js";
import { fetchContent } from "../repository/content.repository.js";

// Mock the prisma client
jest.mock("../config/dbConfig.js", () => ({
  __esModule: true,
  default: {
    resource: {
      findUnique: jest.fn(),
    },
    sectionVersion: {
      findMany: jest.fn(),
    },
    resourceVersionSection: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

describe("fetchContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should format resource data correctly", async () => {
    // Mock resource data
    const mockResource = {
      id: "resource1",
      title: "Home Page",
      slug: "home",
      resourceType: "MAIN_PAGE",
      resourceTag: "HOME",
      relationType: "PARENT",
      liveVersion: {
        id: "version1",
        versionNumber: 1,
        content: {},
        icon: "home-icon",
        Image: "home-image.jpg",
        sections: [],
      },
      newVersionEditMode: {
        id: "version2",
        versionNumber: 2,
        content: {},
        icon: "home-icon-edit",
        Image: "home-image-edit.jpg",
        sections: [],
      },
    };

    // Mock section versions
    const mockSectionVersions = [
      {
        id: "section1",
        section: {
          title: "HeroSection",
          sectionType: {
            name: "HERO_BANNER",
          },
        },
        heading: "Building a Stronger Future",
        description: "Our unwavering commitment...",
        content: {
          title: {
            en: "Building a Stronger Future",
            ar: "بناء مستقبل أقوى",
          },
          description: {
            en: "Our unwavering commitment...",
            ar: "التزامنا الثابت...",
          },
        },
        children: [],
        items: [],
      },
      {
        id: "section2",
        section: {
          title: "aboutUsSection",
          sectionType: {
            name: "MARKDOWN_CONTENT",
          },
        },
        heading: "Driven by excellence in execution",
        description: "With our clients...",
        content: {
          title: {
            en: "Driven by excellence in execution",
            ar: "مدفوعون بالتميز في التنفيذ",
          },
          description: {
            en: "With our clients...",
            ar: "مع عملائنا...",
          },
        },
        children: [],
        items: [],
      },
    ];

    // Mock section order
    const mockSectionOrder = [
      {
        resourceVersionId: "version1",
        sectionVersionId: "section1",
        order: 1,
      },
      {
        resourceVersionId: "version1",
        sectionVersionId: "section2",
        order: 2,
      },
    ];

    // Set up mocks
    prismaClient.resource.findUnique.mockResolvedValue(mockResource);
    prismaClient.sectionVersion.findMany.mockResolvedValue(mockSectionVersions);
    prismaClient.resourceVersionSection.findMany.mockResolvedValue(mockSectionOrder);

    // Call the function
    const result = await fetchContent("resource1");

    // Verify the result
    expect(result).toEqual({
      id: "resource1",
      title: "Home Page",
      slug: "home",
      resourceType: "MAIN_PAGE",
      resourceTag: "HOME",
      relationType: "PARENT",
      liveVersion: {
        id: "version1",
        versionNumber: 1,
        content: {},
        icon: "home-icon",
        image: "home-image.jpg",
        sections: [
          {
            title: "HeroSection",
            SectionType: "HERO_BANNER",
            heading: "Building a Stronger Future",
            description: "Our unwavering commitment...",
            content: {
              title: {
                en: "Building a Stronger Future",
                ar: "بناء مستقبل أقوى",
              },
              description: {
                en: "Our unwavering commitment...",
                ar: "التزامنا الثابت...",
              },
            },
          },
          {
            title: "aboutUsSection",
            SectionType: "MARKDOWN_CONTENT",
            heading: "Driven by excellence in execution",
            description: "With our clients...",
            content: {
              title: {
                en: "Driven by excellence in execution",
                ar: "مدفوعون بالتميز في التنفيذ",
              },
              description: {
                en: "With our clients...",
                ar: "مع عملائنا...",
              },
            },
          },
        ],
      },
      editVersion: {
        id: "version2",
        versionNumber: 2,
        content: {},
        icon: "home-icon-edit",
        image: "home-image-edit.jpg",
        sections: [
          {
            title: "HeroSection",
            SectionType: "HERO_BANNER",
            heading: "Building a Stronger Future",
            description: "Our unwavering commitment...",
            content: {
              title: {
                en: "Building a Stronger Future",
                ar: "بناء مستقبل أقوى",
              },
              description: {
                en: "Our unwavering commitment...",
                ar: "التزامنا الثابت...",
              },
            },
          },
          {
            title: "aboutUsSection",
            SectionType: "MARKDOWN_CONTENT",
            heading: "Driven by excellence in execution",
            description: "With our clients...",
            content: {
              title: {
                en: "Driven by excellence in execution",
                ar: "مدفوعون بالتميز في التنفيذ",
              },
              description: {
                en: "With our clients...",
                ar: "مع عملائنا...",
              },
            },
          },
        ],
      },
    });

    // Verify that the correct functions were called
    expect(prismaClient.resource.findUnique).toHaveBeenCalledWith({
      where: { id: "resource1" },
      include: expect.any(Object),
    });

    expect(prismaClient.sectionVersion.findMany).toHaveBeenCalledTimes(2);
    expect(prismaClient.resourceVersionSection.findMany).toHaveBeenCalledTimes(2);
  });

  it("should return null if resource not found", async () => {
    // Mock resource not found
    prismaClient.resource.findUnique.mockResolvedValue(null);

    // Call the function
    const result = await fetchContent("nonexistent");

    // Verify the result
    expect(result).toBeNull();
  });
});

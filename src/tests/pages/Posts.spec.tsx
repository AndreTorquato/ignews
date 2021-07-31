import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import { getPrismicClient } from "../../services/prismic";
import Posts, { getStaticProps } from "../../pages/posts";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});
jest.mock('../../services/prismic');

const posts = [
  {
    slug: "fake-post",
    title: " Fake post",
    excerpt: "Fake post excerpt",
    updatedAt: "10 de Abril",
  },
];
describe("Home page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("Fake post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "fake-post",
            data: {
              title: [{ type: "heading", text: "Fake post" }],
              content: [{ type: "paragraph", text: "Fake post excerpt" }],
            },
            last_publication_date: "07-31-2021",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "fake-post",
              title: "Fake post",
              excerpt: "Fake post excerpt",
              updatedAt: "July 31, 2021",
            },
          ],
        },
      })
    );
  });
});

import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getSession } from "next-auth/client";
import { getPrismicClient } from "../../services/prismic";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";

jest.mock("next/router");
jest.mock("next-auth/client");

jest.mock("../../services/prismic");

const post = {
  slug: "fake-post",
  title: " Fake post",
  content: "<p>Fake post excerpt</p>",
  updatedAt: "10 de Abril",
};
describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("Fake post")).toBeInTheDocument();
    expect(screen.getByText("Fake post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockReturnValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "fake-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fack-active-subscription",
    } as any);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "Fake post" }],
          content: [{ type: "paragraph", text: "Fake post content" }],
        },
        last_publication_date: "08-01-2021",
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: "fake-post" },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "fake-post",
            title: "Fake post",
            content: "<p>Fake post content</p>",
            updatedAt: "August 01, 2021",
          },
        },
      })
    );
  });
});

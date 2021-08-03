import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { getPrismicClient } from "../../services/prismic";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";

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
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText("Fake post")).toBeInTheDocument();
    expect(screen.getByText("Fake post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);
    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/fake-post");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "Fake post" }],
          content: [{ type: "paragraph", text: "Fake post content" }],
        },
        last_publication_date: "08-01-2021",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "fake-post" },
    });
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

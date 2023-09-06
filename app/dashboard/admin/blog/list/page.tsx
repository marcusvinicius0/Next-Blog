import Link from "next/link";

async function getBlogs(searchParams: any) {
  const urlParams = {
    page: searchParams.page || 1,
  };

  const searchQuery = new URLSearchParams(urlParams).toString();

  const response = await fetch(`${process.env.API}/blog?${searchQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    console.log("Failed to fetch blogs => " + response);
    throw new Error("Failed to fetch blogs");
  }

  const data = await response.json();
  return data; // { blogs, currentPage, totalPages }
}

export default async function AdminBlogsList({ searchParams }) {
  const data = await getBlogs(searchParams);

  const { blogs, currentPage, totalPages } = data;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="max-w-5xl p-2 mt-4">
      <h3 className="text-2xl text-gray-800">Latest Blogs</h3>
      {blogs?.map((blog, index) => (
        <div key={blog._id} className="flex flex-col space-y-2 mt-6">
          <p className="text-1xl font-semibold">{`${index + 1}°`}{" "}{blog.title}</p>
          <Link href={`/dashboard/admin/blog/update/${blog.slug}`} className="w-16 uppercase text-blue-400 font-semibold hover:text-blue-400/90">Update</Link>
          <hr />
        </div>
      ))}
      <div className="mt-4">
        <nav className="">
          <ul className="flex flex-row items-center justify-center space-x-6">
            {hasPreviousPage && (
              <li>
                <Link href={`?page=${currentPage - 1}`}>Previous</Link>
              </li>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <li
                  key={page}
                  className={`${
                    currentPage === page
                      ? "bg-blue-100/90 rounded-full p-1"
                      : "p-1"
                  }`}
                >
                  <Link href={`?page=${page}`}>{page}</Link>
                </li>
              );
            })}

            {hasNextPage && (
              <li>
                <Link href={`?page=${currentPage + 1}`}>Next</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

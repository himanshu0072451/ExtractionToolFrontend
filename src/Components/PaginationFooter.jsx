// components/PaginationFooter.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const PaginationFooter = ({ page, setPage, pages, total, sliceLength }) => (
  <section className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm">
    <span className="text-zinc-400">
      Showing {sliceLength} of {total} records
    </span>
    <div className="flex gap-2 items-center">
      {/* First Page */}
      <Button
        size="sm"
        variant="ghost"
        disabled={page === 1}
        onClick={() => setPage(1)}
      >
        « First
      </Button>

      {/* Previous Page */}
      <Button
        size="sm"
        variant="ghost"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        ← Prev
      </Button>

      {/* Page Info */}
      <span className="text-zinc-400">
        Page {page} of {pages}
      </span>

      {/* Next Page */}
      <Button
        size="sm"
        variant="ghost"
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
      >
        Next →
      </Button>

      {/* Last Page */}
      <Button
        size="sm"
        variant="ghost"
        disabled={page === pages}
        onClick={() => setPage(pages)}
      >
        End »
      </Button>
    </div>
  </section>
);

export default PaginationFooter;

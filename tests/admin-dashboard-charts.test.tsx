import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("AdminDashboardCharts renders both chart titles", async () => {
  const { AdminDashboardCharts } = await import(
    "../components/admin/admin-dashboard-charts"
  );

  const html = renderToStaticMarkup(
    createElement(AdminDashboardCharts, {
      ageGroups: [{ name: "U-10", students: 2 }],
      administration: [
        { name: "Terverifikasi", value: 2 },
        { name: "Belum lengkap", value: 0 },
      ],
    }),
  );

  assert.match(html, /Distribusi siswa per kelas usia/);
  assert.match(html, /Distribusi sebaran administrasi/);
});

import { schedule } from "@netlify/functions";

const BUILD_HOOK =
  "https://api.netlify.com/build_hooks/6697e1f83d3ccfe52de21890";

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
export const handler = schedule("0 */12 * * *", async () => {
  try {
    const response = await fetch(BUILD_HOOK, {
      method: "POST",
    });
    console.log("Build hook response:", response);

    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error calling build hook:", error);

    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
});

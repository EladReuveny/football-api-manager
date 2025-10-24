import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import Logo from "../components/Logo";
import SliddingDashArrowIcon from "../components/SliddingDashArrowIcon";

type LandingPageProps = {};

const LandingPage = ({}: LandingPageProps) => {
  return (
    <section className="text-center">
      <div className="mx-auto inline-block -my-6">
        <Logo width={300} height={300} />
      </div>
      <h1 className="text-5xl font-bold my-6">
        <span className="text-stroke underline decoration-(--color-primary) decoration-4 underline-offset-6">
          Football API Manager
        </span>
      </h1>
      <p className="text-gray-300 text-2xl mx-10">
        A complete platform for {""}
        <span className="text-(--color-primary) font-semibold">
          Managing Football Data
        </span>
        . Perfect for developers, analysts, or admins who want full control over
        structured football statistics and API data.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mt-12 mx-2">
        <FeatureCard
          icon="fas fa-futbol"
          title="Football Data Hub"
          description={
            <>
              A central hub for <b>football data management</b>. Create, update,
              and maintain all football data in a <b>connected, synchronized</b>{" "}
              system for accurate performance tracking.
            </>
          }
        />

        <FeatureCard
          icon="fas fa-chart-line"
          title="Data Analytics"
          description={
            <>
              <b>Visualize</b> and <b>analyze</b> football data with our{" "}
              <b>user-friendly dashboard</b>. Gain insights into player{" "}
              <b>performance</b>, <b>team performance</b>, and{" "}
              <b>league standings</b>.
            </>
          }
        />

        <FeatureCard
          icon="fas fa-users-cog"
          title="User & Role Management"
          description={
            <>
              Admins can <b>manage users</b> and control permissions, while
              standard users have <b>secure, limited access</b> to football
              data.
            </>
          }
        />

        <FeatureCard
          icon="fas fa-database"
          title="RESTful API Access"
          description={
            <>
              Access football data through a <b>secure, scalable REST API</b>.
              Every endpoint is protected by <b>authentication</b> and{" "}
              <b>role-based authorization</b>.
            </>
          }
        />

        <FeatureCard
          icon="fas fa-lock"
          title="Secure Authentication"
          description={
            <>
              Protected by <b>JWT</b> authentication and ready for future{" "}
              <b>OAuth 2.0</b> support. All routes are <b>role-restricted</b> to
              ensure secure access and consistent data protection.
            </>
          }
        />
      </div>

      <div className="mt-14 py-14 bg-gradient-to-r from-(--color-primary)/5 via-(--color-primary)/80 to-(--color-primary)/5 ">
        <h2 className="text-3xl font-bold mb-5">
          Start Managing Your Football Data Today
        </h2>
        <Link
          to="/docs"
          className="relative inline-block font-bold text-lg py-4 px-10 rounded-full overflow-hidden z-1 group
                    text-(--color-bg) bg-(--color-text) hover:bg-transparent
                    before:content-[''] before:absolute before:w-full before:h-full before:top-1/2 before:left-1/2 before:-translate-1/2
                    before:bg-[conic-gradient(red,orange,yellow,green,blue,indigo,violet,red,cyan,purple)]
                    before:animate-[spin_6s_linear_infinite] before:blur-sm
                    after:content-[''] after:absolute after:inset-1 after:rounded-full after:bg-(--color-text)
          "
        >
          <div className="relative z-1 flex items-center gap-1">
            Get Started
            <SliddingDashArrowIcon />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default LandingPage;

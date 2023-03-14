import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const migrateModeActive = process.env.NEXT_PUBLIC_MIGRATE_MODE === "true";

function Navigation() {
  const router = useRouter();
  const [active, setActive] = useState("swap");

  useEffect(() => {
    const activePath = router.asPath;
    if (activePath.includes("migration")) {
      setActive("migration");
    }
    if (activePath.includes("home")) {
      setActive("home");
    }
    if (activePath.includes("swap")) {
      setActive("swap");
    }
    if (activePath.includes("liquidity")) {
      setActive("liquidity");
    }
    if (activePath.includes("vest")) {
      setActive("vest");
    }
    if (activePath.includes("vote")) {
      setActive("vote");
    }
    if (activePath.includes("bribe")) {
      setActive("bribe");
    }
    if (activePath.includes("rewards")) {
      setActive("rewards");
    }
    if (activePath.includes("dashboard")) {
      setActive("dashboard");
    }
  }, [router.asPath]);

  const renderNavs = () => {
    return (
      <>
        {migrateModeActive && renderSubNav("Migration", "migration")}
        {renderSubNav("Swap", "swap")}
        {renderSubNav("Liquidity", "liquidity")}
        {renderSubNav("Vest", "vest")}
        {renderSubNav("Vote", "vote")}
        {renderSubNav("Rewards", "rewards")}
        {renderSubNav("Bribe", "bribe")}
        {renderDocsTab()}
      </>
    );
  };

  const renderSubNav = (title: string, link: string) => {
    return (
      <Link href={"/" + link}>
        <a
          className={`relative m-0 cursor-pointer select-none appearance-none rounded-lg border bg-transparent px-[24px] pt-2 pb-[10px] text-sm font-medium capitalize text-[#7e99b0] no-underline outline-0 ${
            active === link
              ? "border-cantoGreen text-white"
              : "border-transparent"
          } inline-flex items-center justify-center py-6 hover:bg-[hsla(0,0%,100%,.04)]`}
        >
          <div className="m-0 pl-0 text-center text-xs xs:text-base">
            {title}
          </div>
        </a>
      </Link>
    );
  };

  const renderDocsTab = () => {
    return (
      <button
        className="relative m-0 inline-flex cursor-pointer select-none appearance-none items-center justify-center rounded-lg border border-transparent bg-transparent px-[24px] py-6 pt-2 pb-[10px] text-sm font-medium capitalize text-[#7e99b0] no-underline outline-0 hover:bg-[hsla(0,0%,100%,.04)]"
        onClick={() => window.open("https://docs.velocimeter.xyz/", "_blank")}
      >
        <div className="m-0 pl-0 text-center text-xs xs:text-base">Docs</div>
      </button>
    );
  };

  return (
    <>
      <div className="flex items-center rounded-2xl border-0 bg-transparent p-2 text-center shadow-[0_0_0.2em] shadow-cantoGreen max-md:hidden">
        {renderNavs()}
      </div>
      <div className="flex flex-col items-start p-2 text-center md:hidden">
        {renderNavs()}
      </div>
    </>
  );
}

export default Navigation;

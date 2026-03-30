import clsx from "clsx";

const LogoParadeItem = ({
  logo,
  clickable = true,
  className,
  homepage,
  noFilter,
  noLinks,
}: any) => {
  const LogoParadeWrapper = ({ href, children }: any) => {
    const wrapperClass = clsx(
      "inline-flex self-center p-0 animate-[fadein_0.5s_cubic-bezier(0.455,0.03,0.515,0.955)_forwards]",
      !clickable && "cursor-default pointer-events-none",
    );

    return !Boolean(noLinks) && Boolean(href) && clickable ? (
      <a className={wrapperClass} target="_blank" href={href} rel="noopener">
        {children}
      </a>
    ) : (
      <div className={wrapperClass}>{children}</div>
    );
  };
  return (
    <div
      className={clsx(
        className,
        "my-4 mx-[31px] flex items-center justify-center shrink-0 min-w-full",
      )}
      style={{ minWidth: `${logo.width}px` }}
    >
      <LogoParadeWrapper href={clickable ? logo.url || false : false}>
        <img
          className={clsx(
            !noFilter &&
              "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all",
          )}
          src={logo.imageUrl}
          alt={`logo`}
          height={logo.height}
          width={logo.width}
        />
      </LogoParadeWrapper>
    </div>
  );
};

const logoParade = [
  {
    name: "Gatsby",
    imageUrl: `/icons/companies/gatsby.svg`,
    url: "https://www.gatsbyjs.com",
    width: 107,
    height: 29,
  },
  {
    name: "Rapha",
    imageUrl: `/icons/companies/rapha.svg`,
    url: "https://www.rapha.cc/",
    width: 85,
    height: 39,
  },
  {
    name: "Poppy",
    imageUrl: `/icons/companies/poppy.svg`,
    url: "https://poppy.be/",
    width: 110,
    height: 40,
  },
  {
    name: "Twiga",
    imageUrl: `/icons/companies/twiga.svg`,
    url: "https://twiga.com/",
    width: 55,
    height: 61,
  },
  {
    name: "Panther",
    imageUrl: `/icons/companies/panther.svg`,
    url: " https://www.panther.co/",
    width: 122,
    height: 28,
  },
  {
    name: "Grover",
    imageUrl: `/icons/companies/grover.svg`,
    url: "https://www.grover.com/",
    width: 97,
    height: 26,
  },
  {
    name: "Invisible",
    imageUrl: `/icons/companies/invisible.svg`,
    url: "https://inv.tech/",
    width: 182,
    height: 36,
  },
  {
    name: "Elsevier",
    imageUrl: `/icons/companies/elsevier.svg`,
    url: "https://www.elsevier.com/",
    width: 177,
    height: 48,
  },
  {
    name: "Tryg",
    imageUrl: `/icons/companies/tryg.svg`,
    url: "https://www.tryg.com/",
    width: 105,
    height: 45,
  },
  {
    name: "IHI",
    imageUrl: `/icons/companies/ihi.svg`,
    url: "https://www.ihiterrasun.com/",
    width: 225,
    height: 55,
  },
  {
    name: "Insta",
    imageUrl: `/icons/companies/insta.svg`,
    url: "",
    width: 225,
    height: 55,
  },
  {
    name: "Outrider",
    imageUrl: `/icons/companies/outrider.svg`,
    url: "https://outrider.org/",
    width: 225,
    height: 55,
  },
  {
    name: "Oxio",
    imageUrl: `/icons/companies/oxio.svg`,
    url: "https://oxio.com/",
    width: 225,
    height: 55,
  },
  {
    name: "Southpole",
    imageUrl: `/icons/companies/southpole.svg`,
    url: "https://www.southpole.com/",
    width: 173,
    height: 32,
  },
];

const LogoParade = ({
  logos,
  noFade = false,
  homepage = false,
  reverseAnim = false,
  noFilter = false,
  noRandom = false,
  customSpeed = undefined,
  noLinks = true,
  clickable = true,
}: any) => {
  const tmpLogos = logos ? logos : logoParade;
  const finalLogos = noRandom
    ? tmpLogos
    : tmpLogos.sort(() => Math.random() - 0.5);

  const animationSpeed = customSpeed || "135s";

  return (
    <section className="overflow-x-hidden w-full" data-testid="logo-parade">
      {finalLogos.length >= 6 ? (
        <div
          className={clsx(
            "flex flex-row items-center overflow-hidden relative max-w-[1200px] w-full mx-auto h-[100px]",
            "[mask-image:linear-gradient(90deg,transparent_0%,black_15%,black_85%,transparent_100%)]",
            "[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_15%,black_85%,transparent_100%)]",
            noFade &&
              "before:!content-none before:!hidden after:!content-none after:!hidden",
          )}
          style={{
            animationDelay: `calc(${animationSpeed} / 2)`,
          }}
        >
          <div
            className={clsx(
              "shrink-0 absolute w-max min-w-full flex justify-around",
              reverseAnim
                ? "animate-[slidelogoreverse_135s_linear_infinite]"
                : "animate-[slidelogo_135s_linear_infinite]",
              finalLogos.length > 5 && !noFade && "mx-auto",
            )}
            style={{
              animationDuration: animationSpeed,
            }}
          >
            {finalLogos.map((logo: any, index: number) => (
              <LogoParadeItem
                noFilter={noFilter}
                logo={logo}
                key={index}
                homepage={homepage}
                noLinks={noLinks}
                clickable={clickable}
              />
            ))}
          </div>
          <div
            className={clsx(
              "shrink-0 absolute w-max min-w-full flex justify-around",
              reverseAnim
                ? "translate-x-full animate-[slidelogo2reverse_135s_linear_infinite]"
                : "translate-x-full animate-[slidelogo2_135s_linear_infinite]",
              finalLogos.length > 5 && !noFade && "mx-auto",
            )}
            style={{
              animationDuration: animationSpeed,
            }}
          >
            {finalLogos.map((logo: any, index: number) => (
              <LogoParadeItem
                noFilter={noFilter}
                logo={logo}
                key={index}
                homepage={homepage}
                noLinks={noLinks}
                clickable={clickable}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap max-w-screen justify-center">
          {finalLogos.map((logo: any, index: number) => (
            <LogoParadeItem
              noFilter={noFilter}
              logo={logo}
              key={index}
              homepage={homepage}
              noLinks={noLinks}
              clickable={clickable}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default LogoParade;

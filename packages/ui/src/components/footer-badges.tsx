export const gdpr = (basePath = "") => (
  <>
    <img
      src={`${basePath}/badges/gdpr.svg`}
      alt="GDPR"
      width={26}
      height={26}
      loading="lazy"
      className="hidden dark:block"
    />
    <img
      src={`${basePath}/badges/gdpr_light.svg`}
      alt="GDPR"
      width={26}
      height={26}
      className="block dark:hidden"
      loading="lazy"
    />
  </>
);

export const hipaa = (basePath = "") => (
  <>
    <img
      src={`${basePath}/badges/hipaa.svg`}
      alt="HIPAA"
      width={46}
      height={21}
      loading="lazy"
      className="hidden dark:block"
    />
    <img
      src={`${basePath}/badges/hipaa_light.svg`}
      alt="HIPAA"
      width={46}
      height={21}
      className="block dark:hidden"
      loading="lazy"
    />
  </>
);

export const iso27 = (basePath = "") => (
  <>
    <img
      src={`${basePath}/badges/iso27.svg`}
      alt="ISO 27001"
      width={54}
      height={20}
      loading="lazy"
      className="hidden dark:block"
    />
    <img
      src={`${basePath}/badges/iso27_light.svg`}
      alt="ISO 27001"
      width={54}
      height={20}
      className="block dark:hidden"
      loading="lazy"
    />
  </>
);

export const soc2 = (basePath = "") => (
  <>
    <img
      src={`${basePath}/badges/soc2.svg`}
      alt="SOC 2"
      width={44}
      height={20}
      loading="lazy"
      className="hidden dark:block"
    />
    <img
      src={`${basePath}/badges/soc2_light.svg`}
      alt="SOC 2"
      width={44}
      height={20}
      className="block dark:hidden"
      loading="lazy"
    />
  </>
);

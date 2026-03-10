"use client";

import { getTreatmentSections } from "@/backendServer/healthcare";
import { getCurrentUser } from "@/backendServer/user";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { SearchBar } from "@/components/SearchBar";
import { FacebookIcon } from "@/icons/social-media/fb";
import { TwitterIcon } from "@/icons/social-media/twitter";
import { WhatsAppIcon } from "@/icons/social-media/whatsapp";
import { DoctorProfile } from "@/types/healthcare";
import { PatientProfile } from "@/types/patient";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { TreatmentSectionGroup } from "../../components/TreatmentSectionGroup";
import styles from "./style.module.css";

type TopBarProps = {
  user: DoctorProfile | PatientProfile | User | null | undefined;
};

function TopBar({ user }: TopBarProps) {
  const [isTransparent, setIsTransparent] = useState(true);

  function opaqueOnScroll() {
    function onScroll() {
      const { scrollTop } = document.documentElement;

      if (scrollTop === 0) {
        setIsTransparent(true);
      } else {
        setIsTransparent(false);
      }
    }

    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }

  useLayoutEffect(opaqueOnScroll, []);

  return (
    <nav
      className={classNames(styles["nav-container"], {
        [styles["is-transparent"]]: isTransparent,
      })}
    >
      <div className={styles["nav-content"]}>
        <Image src="/logo-small.svg" width={85} height={27} alt="Dctor Logo" />
        <div className={styles["nav-actions-container"]}>
          {user ? (
            <Link href="/dashboard">
              <Button size="large" variant="primary">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button size="large" variant="clear">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="large" variant="primary">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function LandingPage() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser().then((response) => response.data),
  });

  const { data: treatmentSections = [] } = useQuery(["treatmentsSections"], {
    queryFn: () =>
      getTreatmentSections().then((response) => {
        if ("error" in response) {
          return [];
        }

        return response.data;
      }),
  });

  function prefetchDashboard() {
    if (user) {
      router.prefetch("/dashboard");
    }
  }

  useEffect(prefetchDashboard, [router, user]);

  const sampledTreatmentSections = treatmentSections
    .map((section) => ({
      ...section,
      categories: section.categories.slice(0, 4),
    }))
    .slice(0, 4);

  return (
    <div className={styles["landing-page"]}>
      <TopBar user={user} />
      <section className={styles["main-section"]}>
        <div className={styles["main-section-content"]}>
          <div className={styles["greet-container"]}>
            <p className={styles.morning}>Good morning</p>
            <h1 className={styles.title}>
              Feel better about finding{" "}
              <span className={styles.highlighted}>healthcare?</span>
            </h1>
            <p className={styles.subtitle}>
              At Dctor, we take the guesswork out of finding the right doctors
              and care for you and your family
            </p>
          </div>
          <div className={styles["search-box-wrapper"]}>
            <div className={"white-box container"}>
              <p className={styles["search-text"]}>
                Find a Doctor and book your next visit
              </p>
              <SearchBar />
            </div>
            <div className="flex-end">
              <p className={styles["feeling-well-text"]}>
                Are you feeling well?
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles["download-section"]}>
        <div className={styles["download-section-content"]}>
          <Image
            src="/app-screenshot.png"
            width={353}
            height={471}
            alt="Screenshot of Dctor app"
          />
          <div>
            <h1 className={styles["download-section-heading"]}>
              Find a Doctor right at your fingertips
            </h1>
            <p className={styles["download-section-text"]}>
              For a seamless experience, download the app. Available in IOS and
              Android
            </p>
            <div className={styles["download-buttons-container"]}>
              <Image
                src="/download-badges/app-store.svg"
                width={120}
                height={40}
                alt="Download on the App Store"
                style={{ width: "auto", height: "75px" }}
              />
              <Image
                src="/download-badges/play-store.png"
                width={646}
                height={250}
                alt="Get it on Google Play"
                style={{ width: "auto", height: "75px" }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className={styles["categories-section"]}>
        <div className={styles["categories-section-content"]}>
          {sampledTreatmentSections.map((section) => (
            <TreatmentSectionGroup
              key={section.id}
              name={section.name}
              description={section.description}
              categories={section.categories}
              sectionId={section.id}
            />
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.content}>
          <div>
            <h3>Patient</h3>
            <Link href="/search">
              <p>Search for a Doctor/Clinic</p>
            </Link>
          </div>
          <div>
            <h3>Others</h3>
            <Link href="/terms-of-service">
              <p>Terms of Service</p>
            </Link>
            <Link href="/privacy-policy">
              <p>Privacy Policy</p>
            </Link>
          </div>
          <div>
            <h3>Social Media</h3>
            <div className={styles["social-media-items"]}>
              <Link href="#">
                <FacebookIcon />
              </Link>
              <Link href="#">
                <TwitterIcon />
              </Link>
              <Link href="#">
                <WhatsAppIcon />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles["copyright-container"]}>
          <div className={styles["copyright-container-content"]}>
            Copyright © 2023 by DOCTR All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

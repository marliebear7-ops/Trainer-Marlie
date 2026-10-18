const ORGANIZER_ID = "YOUR_ORGANIZER_ID";

const gallery = document.getElementById("tournament-gallery");

async function loadTournaments() {
    try {
        // Make sure you replace the placeholder above.
        if (ORGANIZER_ID === "YOUR_ORGANIZER_ID") {
            throw new Error("Add your Limitless organizer ID first.");
        }

        const apiURL =
            "https://play.limitlesstcg.com/api/tournaments" +
            `?game=PTCG&organizerId=${encodeURIComponent(ORGANIZER_ID)}` +
            "&limit=50";

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Could not retrieve tournaments.");
        }

        const tournaments = await response.json();

        // Sort upcoming events first, followed by recent past events.
        const now = Date.now();

        tournaments.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            const upcomingA = dateA >= now;
            const upcomingB = dateB >= now;

            if (upcomingA && !upcomingB) return -1;
            if (!upcomingA && upcomingB) return 1;

            return upcomingA
                ? dateA - dateB
                : dateB - dateA;
        });

        const displayedTournaments = tournaments.slice(0, 6);

        if (displayedTournaments.length === 0) {
            gallery.innerHTML = `
                <p class="tournament-message">
                    No tournaments found yet. Check back soon!
                </p>
            `;
            return;
        }

        gallery.innerHTML = "";

        displayedTournaments.forEach(tournament => {
            const card = document.createElement("article");
            card.className = "tournament-card";

            const eventDate = new Date(tournament.date);
            const dateText = Number.isNaN(eventDate.getTime())
                ? "Date to be announced"
                : eventDate.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                });

            const formatNames = {
                STANDARD: "Standard",
                EXPANDED: "Expanded",
                GL: "Gym Leader Challenge"
            };

            const formatText =
                formatNames[tournament.format] ||
                tournament.format ||
                "Pokémon TCG";

            const title = document.createElement("h3");
            title.textContent = tournament.name || "Pokémon TCG Tournament";

            const format = document.createElement("span");
            format.className = "tournament-format";
            format.textContent = formatText;

            const details = document.createElement("div");
            details.className = "tournament-details";

            const date = document.createElement("p");
            date.textContent = `📅 ${dateText}`;

            const players = document.createElement("p");
            players.textContent =
                `👥 ${tournament.players ?? "—"} players`;

            const link = document.createElement("a");
            link.className = "tournament-card-link";
            link.href =
                "https://play.limitlesstcg.com/tournament/" +
                encodeURIComponent(tournament.id);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View tournament →";

            details.append(date, players);
            card.append(title, format, details, link);
            gallery.appendChild(card);
        });

    } catch (error) {
        console.error("Tournament gallery error:", error);

        gallery.innerHTML = `
            <p class="tournament-message">
                Tournaments could not be loaded right now.
                Please visit Limitless to see my events.
            </p>
        `;
    }
}

loadTournaments();
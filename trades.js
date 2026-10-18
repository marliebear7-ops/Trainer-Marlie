/* ---------- Google Form Configuration ---------- */

const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScNhDP9iE38jHexgKEXqCVhEBU0TrU-jaKW76d1O7EztbO2mA/viewform";
const CARD_QUESTION_ENTRY = "entry.1161173784";

/* ---------- Featured Trade Cards ---------- */

const featuredCards = [
    "sv08-247",
    "dpp-DP34",
    "pop9-5",
    "me03-095",
    "me01-160",
    "30th-133",
    "sv08-214",
    "sv10-194",
];

/* ---------- Physical Card Photographs ---------- */

const physicalCardPhotos = {
    "sv08-247": "images/trade-cards/sv08-247.JPG",
    "dpp-DP34" : "images/trade-cards/dpp-DP34.jpg",
    "pop9-5" : "images/trade-cards/pop9-5.jpg",
    "me03-095" : "images/trade-cards/me03-095.JPG",
    "me01-160" : "images/trade-cards/me01-160.JPG",
    "30th-133" : "images/trade-cards/30th-133.jpg",
    "sv08-214" : "images/trade-cards/sv08-214.jpg",
    "sv10-194" : "images/trade-cards/sv10-194.jpg",
};

/* ---------- Trade Gallery ---------- */

const gallery = document.getElementById("trade-gallery");

/* ---------- Load Trade Cards ---------- */

async function loadTradeCards() {
    if (!gallery) {
        console.error('Could not find the "trade-gallery" element.');
        return;
    }

    gallery.replaceChildren();

    for (const cardId of featuredCards) {
        try {
            // Fetch card information from TCGdex.
            const response = await fetch(
                `https://api.tcgdex.net/v2/en/cards/${cardId}`
            );

            if (!response.ok) {
                throw new Error(
                    `Card request failed: HTTP ${response.status}`
                );
            }

            const card = await response.json();

            // Create the main card container.
            const article = document.createElement("article");
            article.className = "trade-card";


            /* ---------- Card Image Flip ---------- */

            const flip = document.createElement("div");
            flip.className = "trade-card-flip";

            const flipInner = document.createElement("div");
            flipInner.className = "trade-card-flip-inner";


            // Front: Official card artwork.
            const front = document.createElement("div");
            front.className = "trade-card-flip-front";

            const frontImage = document.createElement("img");

            if (card.image) {
                frontImage.src = `${card.image}/high.png`;
            }

            frontImage.alt = `${card.name} card artwork`;
            frontImage.loading = "lazy";

            front.append(frontImage);
            flipInner.append(front);


            // Back: Photograph of the physical card.
            const physicalPhoto = physicalCardPhotos[card.id];

            if (physicalPhoto) {
                const back = document.createElement("div");
                back.className = "trade-card-flip-back";

                const backImage = document.createElement("img");
                backImage.src = physicalPhoto;
                backImage.alt = `Physical copy of ${card.name}`;
                backImage.loading = "lazy";

                back.append(backImage);
                flipInner.append(back);

                flip.classList.add("has-back");
            }

            flip.append(flipInner);


            /* ---------- Card Information ---------- */

            const title = document.createElement("h2");
            title.textContent = card.name;

            const set = document.createElement("p");
            set.textContent =
                `${card.set?.name ?? "Unknown set"} · #${card.localId}`;


            /* ---------- Google Form Trade Button ---------- */

            const tradeButton = document.createElement("a");
            tradeButton.className = "trade-button";
            tradeButton.textContent = "Interested in trading?";

            // Build a prefilled Google Form URL.
            const formUrl = new URL(GOOGLE_FORM_URL);

            formUrl.searchParams.set(
                CARD_QUESTION_ENTRY,
                `${card.name} — ${card.set?.name ?? "Unknown set"} #${card.localId}`
            );

            tradeButton.href = formUrl.toString();
            tradeButton.target = "_blank";
            tradeButton.rel = "noopener noreferrer";


            /* ---------- Add Card to Gallery ---------- */

            article.append(flip, title, set, tradeButton);
            gallery.append(article);

        } catch (error) {
            console.error(`Error loading card ${cardId}:`, error);

            const message = document.createElement("p");
            message.textContent =
                `Could not load ${cardId}. Check the browser console for details.`;

            gallery.append(message);
        }
    }
}


/* ---------- Initialize Gallery ---------- */

loadTradeCards();

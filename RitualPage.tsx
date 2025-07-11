import { useParams } from "wouter";
import RitualLandingPage from "@/components/RitualLandingPage";
import NotFound from "@/pages/not-found";

// Sacred ritual data matching Seraphine's recommendations
const sacredRituals = {
  "clarity-calm": {
    title: "Clarity & Calm Session",
    subtitle: "A sacred journey to quiet the mind and receive divine clarity",
    steps: [
      "Create a sacred space by lighting a white candle and placing rose quartz nearby",
      "Begin with 7 deep breaths, inhaling clarity and exhaling confusion",
      "Place your hands on your heart and speak: 'I am open to divine clarity'",
      "Spend 10 minutes in silent meditation, asking for guidance on your current situation",
      "Journal any insights, symbols, or messages that come through",
      "Close by expressing gratitude for the clarity received"
    ],
    prayer: "Divine Mother, grant me the clarity to see my path clearly and the calm to trust in your divine timing. May confusion be replaced with certainty, and anxiety with peace. I am aligned with my highest good. Amen.",
    sessionLink: "sms:310-990-6264?body=Hi Vanessa, I'm interested in booking a Clarity & Calm session ($222) after exploring the ritual page."
  },
  "abundance-upgrade": {
    title: "Abundance Frequency Upgrade",
    subtitle: "Elevate your energetic frequency to attract divine abundance",
    steps: [
      "Gather citrine, green aventurine, and a gold candle for abundance energy",
      "Create an abundance altar with symbols of prosperity (coins, fresh flowers, crystals)",
      "Anoint yourself with a prosperity oil blend on wrists and heart center",
      "Recite abundance affirmations for 15 minutes while holding your crystals",
      "Visualize golden light filling your entire being and expanding your aura",
      "Write down 3 specific abundance goals and place them on your altar"
    ],
    prayer: "Universe of infinite abundance, I align myself with the frequency of prosperity. I release all blocks to receiving and open myself to divine wealth in all forms. I am worthy of abundance. It flows to me easily and effortlessly. So it is.",
    sessionLink: "sms:310-990-6264?body=Hi Vanessa, I'm interested in booking an Abundance Frequency Upgrade session ($333) after exploring the ritual page."
  },
  "divine-reset": {
    title: "Divine Reset Ritual",
    subtitle: "A powerful transformation ceremony for complete spiritual renewal",
    steps: [
      "Prepare a ritual bath with Epsom salts, lavender, and rose petals",
      "Soak for 20 minutes while visualizing all old energy washing away",
      "After the bath, sage or palo santo yourself and your space thoroughly",
      "Burn a piece of paper with what you're releasing written on it",
      "Anoint yourself with sacred oils while setting new intentions",
      "Meditate with selenite and clear quartz for 30 minutes",
      "Seal the ritual by drinking blessed water and expressing gratitude"
    ],
    prayer: "Sacred Source, I surrender all that no longer serves my highest good. I release old patterns, limiting beliefs, and past wounds. Fill me now with fresh divine energy. I am reborn in this moment, aligned with my true purpose. Thank you for this sacred reset.",
    sessionLink: "sms:310-990-6264?body=Hi Vanessa, I'm interested in booking a Divine Reset Ritual session ($444) after exploring the ritual page."
  },
  "path-purpose": {
    title: "Path & Purpose Alignment",
    subtitle: "Divine guidance to align with your soul's true calling",
    steps: [
      "Create a vision board with images representing your ideal life path",
      "Light purple and white candles for spiritual guidance and clarity",
      "Hold amethyst while asking: 'What is my soul's true purpose?'",
      "Journal freely for 20 minutes without censoring thoughts",
      "Pull oracle or tarot cards for additional divine messages",
      "Create a sacred action plan with 3 steps toward your purpose"
    ],
    prayer: "Divine guides and angels, illuminate my path and reveal my true purpose. Help me align my actions with my soul's calling. Remove any fears or doubts that keep me from stepping fully into my power. I trust in divine timing and divine guidance.",
    sessionLink: "sms:310-990-6264?body=Hi Vanessa, I'm interested in booking a Path & Purpose Alignment session ($288) after exploring the ritual page."
  }
};

export default function RitualPage() {
  const params = useParams();
  const ritualKey = params.ritual as keyof typeof sacredRituals;
  const ritual = sacredRituals[ritualKey];

  if (!ritual) {
    return <NotFound />;
  }

  return <RitualLandingPage {...ritual} />;
}
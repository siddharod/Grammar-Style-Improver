import re
from typing import Dict, Any, List


class ReadabilityService:
    """Service for local calculation of linguistic and readability metrics."""

    # Pre-compiled regex patterns for performance
    SENTENCE_SPLIT_REGEX = re.compile(r"[.!?]+(?:\s+|$)")
    WORD_REGEX = re.compile(r"\b[a-zA-Z0-9']+\b")
    VOWEL_RUNS_REGEX = re.compile(r"[aeiouy]+", re.IGNORECASE)

    @classmethod
    def count_syllables_in_word(cls, word: str) -> int:
        """
        Estimate syllable count for an English word using phonetic heuristics.
        Handles diphthongs, silent trailing 'e', 'le' endings, and common prefixes/suffixes.
        """
        word = word.lower().strip()
        if not word:
            return 0

        # Strip non-alpha characters
        clean_word = re.sub(r"[^a-z]", "", word)
        if not clean_word:
            return 0

        # Short words edge cases
        if len(clean_word) <= 3:
            return 1

        # Count vowel groups
        vowel_matches = cls.VOWEL_RUNS_REGEX.findall(clean_word)
        count = len(vowel_matches)

        # Discard silent trailing 'e' (e.g., 'rate', 'taste', 'cake', but not 'le' endings like 'table')
        if clean_word.endswith("e") and not clean_word.endswith("le"):
            # Check if previous letter is a consonant and preceded by another vowel
            if len(clean_word) > 2 and clean_word[-2] not in "aeiouy":
                count -= 1

        # Handle 'le' endings preceded by consonant (e.g. 'candle', 'bottle', 'simple')
        if len(clean_word) >= 3 and clean_word.endswith("le") and clean_word[-3] not in "aeiouy":
            # If the preceding 'le' wasn't already caught as a separate vowel run
            if not clean_word.endswith("ele"):
                count += 0  # usually handled by 'le' sound; ensure at least 2 for table

        # Common endings that don't add syllables: 'ed' (e.g. 'walked', 'jumped')
        # unless preceded by 'd' or 't' (e.g. 'wanted', 'needed')
        if clean_word.endswith("ed") and len(clean_word) > 3:
            if clean_word[-3] not in ["t", "d"] and count > 1:
                count -= 1

        # Common ending 'es' preceded by consonants other than 's', 'z', 'x', 'ch', 'sh'
        if clean_word.endswith("es") and len(clean_word) > 3:
            if clean_word[-3] not in ["s", "z", "x", "c", "h"] and count > 1:
                count -= 1

        return max(1, count)

    @classmethod
    def is_complex_word(cls, word: str) -> bool:
        """
        A word is considered complex if it has 3 or more syllables,
        excluding proper nouns and common regular inflectional endings.
        """
        clean_word = re.sub(r"[^a-z]", "", word.lower())
        if len(clean_word) < 6:
            return False
        return cls.count_syllables_in_word(clean_word) >= 3

    @classmethod
    def compute_metrics(cls, text: str) -> Dict[str, Any]:
        """
        Compute standard readability and structural metrics for text locally.
        Returns a dictionary conforming to the frontend ReadabilityMetrics contract.
        """
        text = text.strip() if text else ""
        if not text:
            return {
                "fleschScore": 100.0,
                "fleschCategory": "N/A",
                "gradeLevel": "N/A",
                "readingTimeMinutes": 0.0,
                "wordCount": 0,
                "characterCount": 0,
                "sentenceCount": 0,
                "averageSentenceLength": 0.0,
                "averageSyllablesPerWord": 0.0,
                "complexWordPercentage": 0.0,
                "isMeaningful": False,
                "sampleSizeNotice": "No text provided to evaluate.",
            }

        # Character counts
        char_count = len(text)

        # Word tokens
        words: List[str] = cls.WORD_REGEX.findall(text)
        word_count = len(words)

        # Sentence tokens
        raw_sentences = cls.SENTENCE_SPLIT_REGEX.split(text)
        sentences = [s.strip() for s in raw_sentences if s.strip()]
        sentence_count = len(sentences) if len(sentences) > 0 else 1

        if word_count == 0:
            return {
                "fleschScore": 100.0,
                "fleschCategory": "N/A",
                "gradeLevel": "N/A",
                "readingTimeMinutes": 0.0,
                "wordCount": 0,
                "characterCount": char_count,
                "sentenceCount": sentence_count,
                "averageSentenceLength": 0.0,
                "averageSyllablesPerWord": 0.0,
                "complexWordPercentage": 0.0,
                "isMeaningful": False,
                "sampleSizeNotice": "No alphabetical words detected.",
            }

        # Average Sentence Length (ASL)
        asl = word_count / max(1, sentence_count)

        # Syllables and complex words
        total_syllables = sum(cls.count_syllables_in_word(w) for w in words)
        asw = total_syllables / word_count
        complex_words = sum(1 for w in words if cls.is_complex_word(w))
        complex_word_pct = round((complex_words / word_count) * 100, 1)

        # Flesch Reading Ease formula: 206.835 - (1.015 * ASL) - (84.6 * ASW)
        raw_flesch = 206.835 - (1.015 * asl) - (84.6 * asw)
        flesch_score = round(max(0.0, min(100.0, raw_flesch)), 1)

        # Categorize Flesch score
        if flesch_score >= 90.0:
            flesch_category = "Very Easy"
            grade_level = "5th Grade"
        elif flesch_score >= 80.0:
            flesch_category = "Easy"
            grade_level = "6th Grade"
        elif flesch_score >= 70.0:
            flesch_category = "Fairly Easy"
            grade_level = "7th Grade"
        elif flesch_score >= 60.0:
            flesch_category = "Standard"
            grade_level = "8th to 9th Grade"
        elif flesch_score >= 50.0:
            flesch_category = "Fairly Difficult"
            grade_level = "10th to 12th Grade"
        elif flesch_score >= 30.0:
            flesch_category = "Difficult"
            grade_level = "College Level"
        else:
            flesch_category = "Very Confusing"
            grade_level = "Graduate Level"

        # Reading time (standard average reading speed of 200 words per minute)
        reading_time = max(0.1, round(word_count / 200.0, 1))

        # Statistical validity check for short text
        is_meaningful = word_count >= 8
        sample_notice = (
            None
            if is_meaningful
            else f"Sample text is brief ({word_count} words). Standard Flesch Reading Ease formulas are designed for multi-sentence passages, so metrics are preliminary approximations."
        )

        return {
            "fleschScore": flesch_score,
            "fleschCategory": flesch_category,
            "gradeLevel": grade_level,
            "readingTimeMinutes": reading_time,
            "wordCount": word_count,
            "characterCount": char_count,
            "sentenceCount": sentence_count,
            "averageSentenceLength": round(asl, 1),
            "averageSyllablesPerWord": round(asw, 2),
            "complexWordPercentage": complex_word_pct,
            "isMeaningful": is_meaningful,
            "sampleSizeNotice": sample_notice,
        }

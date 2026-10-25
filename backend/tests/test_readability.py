from services.readability_service import ReadabilityService


def test_syllable_counting():
    """Verify syllable counting accuracy for common English phonetic patterns."""
    assert ReadabilityService.count_syllables_in_word("the") == 1
    assert ReadabilityService.count_syllables_in_word("cat") == 1
    assert ReadabilityService.count_syllables_in_word("apple") >= 2
    assert ReadabilityService.count_syllables_in_word("sentence") == 2
    assert ReadabilityService.count_syllables_in_word("methodology") >= 4
    assert ReadabilityService.count_syllables_in_word("university") >= 4


def test_complex_word_detection():
    """Verify classification of complex words (>=3 syllables)."""
    assert ReadabilityService.is_complex_word("cat") is False
    assert ReadabilityService.is_complex_word("simple") is False
    assert ReadabilityService.is_complex_word("methodology") is True
    assert ReadabilityService.is_complex_word("consequently") is True


def test_empty_text_metrics():
    """Verify metrics calculation on empty or whitespace strings."""
    metrics = ReadabilityService.compute_metrics("")
    assert metrics["wordCount"] == 0
    assert metrics["sentenceCount"] == 0
    assert metrics["fleschScore"] == 100.0


def test_standard_text_metrics():
    """Verify standard text readability metrics calculation."""
    text = (
        "The experimental methodology was executed in order to ascertain the parameters of neural convergence. "
        "Further investigations are required to substantiate these assertions."
    )
    metrics = ReadabilityService.compute_metrics(text)

    assert metrics["wordCount"] == 22
    assert metrics["sentenceCount"] == 2
    assert metrics["averageSentenceLength"] == 11.0
    assert metrics["averageSyllablesPerWord"] > 1.0
    assert metrics["fleschScore"] >= 0.0
    assert metrics["fleschScore"] <= 100.0
    assert metrics["fleschCategory"] in [
        "Very Easy",
        "Easy",
        "Fairly Easy",
        "Standard",
        "Fairly Difficult",
        "Difficult",
        "Very Confusing",
    ]
    assert metrics["readingTimeMinutes"] >= 0.1


def test_conversational_text_metrics():
    """Verify standard readable conversational English metrics."""
    text = "This is a simple book for young kids. The dog ran in the green yard. It was a good day."
    metrics = ReadabilityService.compute_metrics(text)
    assert metrics["wordCount"] == 20
    assert metrics["sentenceCount"] == 3
    assert metrics["fleschScore"] > 80.0
    assert metrics["fleschCategory"] in ["Very Easy", "Easy"]
    assert metrics["isMeaningful"] is True
    assert metrics["sampleSizeNotice"] is None


def test_short_text_edge_cases():
    """Verify short text triggers sampleSizeNotice and isMeaningful=False."""
    short_text = "Good morning everyone."
    metrics = ReadabilityService.compute_metrics(short_text)
    assert metrics["wordCount"] == 3
    assert metrics["isMeaningful"] is False
    assert metrics["sampleSizeNotice"] is not None
    assert "brief" in metrics["sampleSizeNotice"].lower()

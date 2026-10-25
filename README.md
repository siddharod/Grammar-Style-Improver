# Grammar & Style Improver

**An AI-powered writing assistant for clearer, more accurate, and more effective writing.**

Improve grammar, correct spelling, evaluate readability, refine tone, and enhance writing style through a simple web-based interface.

<!-- Add a project screenshot here after the interface is implemented. -->

## Overview

Grammar & Style Improver is a web-based writing assistance project designed to help users improve the quality of their written content. It combines rule-based grammar checking, readability analysis, and AI-powered text refinement in one workflow.

The application is designed around a simple idea: writing should not only be grammatically correct but also clear, readable, and appropriate for its intended audience.

Users can submit text for analysis, review grammar and spelling suggestions, evaluate readability, and request improvements to tone and style.

## Key Features

- **Grammar Checking:** Identify potential grammatical errors and receive correction suggestions.
- **Spelling Analysis:** Detect possible spelling mistakes using a grammar-checking service.
- **Readability Analysis:** Calculate the Flesch Reading Ease score locally to estimate how easy a text is to understand.
- **Tone Improvement:** Use an AI model to adjust writing tone according to the intended purpose.
- **Style Optimization:** Refine sentences for clarity, flow, conciseness, and readability.
- **AI Provider Flexibility:** Integrate Google Gemini and Groq as alternative AI providers, subject to configuration.
- **Result Presentation:** Present the original text, analysis results, and improved version in a user-friendly interface.
- **API-Based Architecture:** Separate frontend, backend processing, grammar analysis, readability calculation, and AI refinement.

*Feature availability depends on the implementation and configuration of the respective APIs.*

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| Grammar and spelling | LanguageTool API |
| AI text refinement | Google Gemini API |
| Alternative AI provider | Groq API |
| Readability analysis | Local Flesch Reading Ease calculation |
| Communication | HTTP / REST-style requests |
| Configuration | Python environment variables and `.env` |
| Development tools | Visual Studio Code, Git, GitHub |

## System Architecture

The application follows a modular processing workflow.

```text
                 USER
                   |
                   v
          Web-Based Interface
             HTML / CSS / JS
                   |
                   v
           Python Flask Backend
                   |
          Input Validation
                   |
          +--------+---------+
          |        |         |
          v        v         v
     LanguageTool  Local    AI Text
       Analysis   Analysis  Refinement
                    |          |
                    v          v
                Readability  Gemini
                 Scoring     or Groq
          |        |         |
          +--------+---------+
                   |
                   v
          Result Processing
                   |
                   v
        Improved Text and Results
                   |
                   v
              USER INTERFACE
```

### Processing Workflow

1. **User Input:** The user enters or pastes text into the application.
2. **Input Validation:** The backend validates the submitted content before processing it.
3. **Grammar and Spelling Analysis:** The text is sent to LanguageTool for possible grammar and spelling issues.
4. **Readability Analysis:** The backend calculates a Flesch Reading Ease score locally.
5. **Tone and Style Optimization:** The text can be submitted to Gemini or Groq for AI-assisted rewriting.
6. **Result Processing:** Available analysis results and the improved text are organized for presentation.
7. **Result Presentation:** The frontend displays the results so users can review and compare their writing.

The diagram describes the intended architecture; actual execution depends on the implemented modules and configured services.

## Project Structure

A suggested project structure is shown below. Adjust the filenames to match your actual repository.

```text
grammar-style-improver/
│
├── app.py                    # Flask application entry point
├── requirements.txt          # Python dependencies
├── .env.example              # Example environment variables
├── .gitignore                # Files excluded from Git
├── README.md                 # Project documentation
│
├── templates/
│   └── index.html             # Main web interface
│
├── static/
│   ├── css/
│   │   └── style.css          # Interface styling
│   └── js/
│       └── script.js          # Frontend interactions
│
├── services/
│   ├── grammar_checker.py     # LanguageTool integration
│   ├── readability.py         # Readability calculation
│   └── ai_rewriter.py         # Gemini / Groq integration
│
└── tests/
    └── test_app.py            # Application tests
```

## Prerequisites

Before running the application, install:

- Python 3.10 or a compatible version supported by your dependencies.
- `pip`, the Python package installer.
- A modern web browser.
- A code editor such as Visual Studio Code.
- API credentials for the AI provider you intend to use.

LanguageTool and AI services require network access when their hosted APIs are used. Readability scoring can be performed locally.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/grammar-style-improver.git
cd grammar-style-improver
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Create a virtual environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` has not yet been created, add the packages required by your actual implementation. Typical dependencies may include:

```text
Flask
requests
python-dotenv
```

Additional packages may be necessary depending on how the readability calculator and AI integrations are implemented.

### 4. Configure environment variables

Create a `.env` file in the project root. Use the following template and configure only the providers your implementation supports.

```env
FLASK_DEBUG=0

LANGUAGETOOL_URL=https://api.languagetool.org/v2/check

GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Keep your real credentials private. Do not commit the `.env` file to GitHub.

### 5. Run the application

If `app.py` is the Flask entry point:

```bash
python app.py
```

Open the local URL printed by Flask in your browser, commonly `http://127.0.0.1:5000/`.

**Note:** These commands assume the application uses the proposed filenames and configuration. Update them if your implementation differs.

## API Integrations

### LanguageTool API

LanguageTool is used to identify potential grammar, spelling, and writing-rule issues.

Typical workflow:

1. Submit the text to the configured LanguageTool endpoint.
2. Receive the analysis response.
3. Extract relevant matches and correction suggestions.
4. Present the suggestions to the user.

The public endpoint may have usage limits, availability restrictions, or service policies. Check the provider's current terms before relying on it for production use.

### Google Gemini API

Gemini is intended to provide AI-assisted rewriting and style refinement.

Potential tasks include:
- Improving sentence clarity.
- Correcting awkward phrasing.
- Adjusting tone for a specific audience.
- Making writing more concise while preserving meaning.

Obtain credentials through [Google AI Studio](https://aistudio.google.com/).

### Groq API

Groq is an alternative AI provider that can be integrated for text refinement when configured.

Potential uses include:
- Rewriting text in a requested tone.
- Improving readability and flow.
- Providing an alternative to the primary AI provider.

Obtain credentials through [Groq Console](https://console.groq.com/).

**Provider fallback:** A fallback mechanism should be implemented explicitly. If Gemini fails, the backend can attempt Groq, or vice versa, provided that valid credentials and compatible model settings are available. Merely configuring both API keys does not automatically enable fallback.

## Readability Analysis

The project uses the **Flesch Reading Ease** formula to estimate how easy a passage is to read.

\[
206.835 - 1.015\left(\frac{\text{words}}{\text{sentences}}\right)
-84.6\left(\frac{\text{syllables}}{\text{words}}\right)
\]

The score is calculated using the number of words, sentences, and syllables in the submitted text.

General interpretation:

| Score | General interpretation |
|---|---|
| 90–100 | Very easy |
| 80–89 | Easy |
| 70–79 | Fairly easy |
| 60–69 | Standard |
| 50–59 | Fairly difficult |
| 30–49 | Difficult |
| 0–29 | Very difficult |

These ranges are general guidelines, not a definitive measure of writing quality. Syllable counting, sentence detection, abbreviations, and specialized vocabulary can affect the result.

## Example Use Case

**Original text**

> The implementation of the system facilitates the enhancement of the readability of textual content.

**Illustrative improved version**

> The system makes written content easier to read.

The example demonstrates the intended style-improvement goal. It is illustrative, not a recorded output from a tested application.

## Testing and Verification

Testing should cover the following areas before the project is considered complete.

| Test area | Expected behavior |
|---|---|
| Empty input | Display a suitable validation message |
| Valid text | Process the submitted content |
| Grammar analysis | Return available grammar suggestions |
| Readability scoring | Calculate a score for supported text |
| AI rewriting | Return refined text when the provider succeeds |
| Invalid API credentials | Handle authentication errors gracefully |
| API timeout | Show an appropriate error or use configured fallback |
| Long input | Apply documented input limits and handle requests safely |
| Special characters | Process supported characters without breaking the interface |

Record actual outputs and test statuses after executing each test. Do not report unexecuted tests as passed.

## Security and Reliability

- Store API keys in environment variables rather than source code.
- Add `.env`, `venv/`, `__pycache__/`, and generated files to `.gitignore`.
- Validate user input on the server.
- Set reasonable input-size limits and request timeouts.
- Handle API errors, rate limits, and unavailable services.
- Avoid logging API keys or unnecessarily storing submitted text.
- Treat AI-generated text as a suggestion that users should review.
- Use Flask debug mode only for local development.
- Apply appropriate deployment security settings before making the application publicly accessible.

## Current Development Status

This repository documents the design and intended capabilities of the Grammar & Style Improver project. Implementation and testing status should be updated to reflect the actual state of the code.

Before presenting the project as complete, verify that:
- The Flask application starts successfully.
- Grammar analysis works with valid inputs.
- Readability calculations return reasonable results.
- At least one configured AI provider can generate improved text.
- Error handling works when an API is unavailable.
- The interface and end-to-end workflow have been tested.

## Future Enhancements

- Before-and-after text comparison.
- Custom tone presets for academic, professional, and conversational writing.
- Sentence-level explanations for grammar corrections.
- Downloadable reports or improved-text exports.
- Multilingual writing support.
- Automated tests and continuous integration.
- Deployment to a cloud hosting platform.

## Learning Outcomes

This project provides practical experience with:

- Python backend development using Flask.
- Frontend development using HTML, CSS, and JavaScript.
- Integrating external HTTP APIs.
- Environment-variable-based configuration.
- Natural language processing concepts.
- Readability metrics and text analysis.
- Error handling, testing, and secure development practices.

## References

- [LanguageTool](https://languagetool.org/)
- [LanguageTool HTTP API](https://languagetool.org/http-api/)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Groq Console](https://console.groq.com/)
- [Groq API Documentation](https://console.groq.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Python Documentation](https://docs.python.org/3/)



Repository: `Grammar-Style-Improver`


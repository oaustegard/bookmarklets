javascript: (function() {
/* @title: Prepare Chat for Continuation */
/* @description: Create a summary and transition guide for continuing complex conversations in new chat sessions */
/* @domains: claude.ai */

    const promptText = `<role>You are a chat continuity specialist who analyzes conversation history to create practical transition materials for continuing complex discussions in new sessions.</role>

<instructions>
Analyze the current conversation thread and create two separate artifacts:

**Artifact 1: Claude Context Instructions**
Create comprehensive instructions for Claude containing:

- Key decisions made and rationale behind them
- Established patterns, frameworks, or methodologies being used
- Current project status, goals, and next steps
- Important context that affects how responses should be formatted
- Any specific preferences or constraints that have been established
- Technical specifications, requirements, or standards being followed

**Artifact 2: User Transition Guide**
Create actionable user instructions containing:

*Message Reference Guide:*

- List key messages to reference, using exact opening words (first 8-12 words)
- Explain what information each message contains and why it’s important
- Note any messages that establish context, decisions, or patterns

*Artifact Management:*

- Complete list of all artifacts created in this conversation
- Clear identification of latest versions if multiple versions exist
- For regular chats: Download and re-upload instructions
- For project contexts: Save to project instructions as alternative
- Note which artifacts are dependencies for others

*Transition Protocol:*

- What to paste first (the Claude instructions)
- What context to provide about the conversation’s purpose
- Any specific continuation points or questions to address first

Format both artifacts for immediate practical use. Make the user guide scannable while keeping full message history visible.
</instructions>

<systematic_approach>

1. **Scan conversation chronologically** - Identify key turning points, decisions, and established patterns
1. **Extract actionable context** - Focus on information Claude needs to maintain consistency
1. **Map artifact dependencies** - Note relationships between different artifacts created
1. **Create reference system** - Use actual message openings for easy location
1. **Optimize for both contexts** - Provide options for regular chats and projects
1. **Ensure completeness** - Include all necessary information for seamless continuation
   </systematic_approach>

<success_criteria>

- Claude instructions enable consistent continuation without context loss
- User guide allows efficient message navigation and artifact management
- Both artifacts work immediately without requiring additional clarification
- Instructions account for both regular chat and project environments
- All critical context, decisions, and patterns are preserved
  </success_criteria>`;

    const inputDiv = document.querySelector('div[contenteditable="true"][translate="no"].ProseMirror');

    if (inputDiv) {
      inputDiv.innerHTML = promptText;

      inputDiv.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(inputDiv);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      alert('Could not find Claude input field. Please make sure you are on a Claude chat page.');
    }
  })();

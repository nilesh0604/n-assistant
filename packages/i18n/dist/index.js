// locales/en/messages.json
var messages_default = {
  app_metadata_description: {
    description: "Extension description",
    message: "AI-powered browser automation! N-assistant helps you automate web tasks, extract data, fill forms, and more."
  },
  app_metadata_name: {
    description: "Extension name",
    message: "N-assistant: AI Web Automation"
  },
  common_cancel: {
    message: "Cancel"
  },
  common_submit: {
    message: "Submit"
  },
  common_processing: {
    message: "Processing..."
  },
  exec_intent_clarification_default: {
    description: "Default clarification message when none provided",
    message: "I need more information to complete this task accurately. Please provide additional details about what you want me to do."
  },
  exec_intent_clarification_needed: {
    description: "Intent clarification needed message",
    message: "I need clarification to help you better"
  },
  exec_intent_be_more_specific: {
    description: "Request for more specific task description",
    message: "Be more specific about what you want me to do"
  },
  exec_intent_provide_context: {
    description: "Request for additional context",
    message: "Provide more context about your goal"
  },
  exec_intent_example_clarification: {
    description: "Example of clarification request",
    message: "For example: instead of 'fill the form', say 'fill the contact form with name John Doe and email john@example.com'"
  },
  errors_unknown: {
    message: "Unknown error occurred"
  },
  errors_conn_serviceWorker: {
    message: "Failed to connect to service worker"
  },
  errors_cmd_unknown: {
    message: "Unsupported command: $COMMAND$.\n\nAvailable commands: /state, /nohighlight, /replay <historySessionId>",
    placeholders: {
      command: {
        content: "$1",
        example: "/unknown"
      }
    }
  },
  nav_newChat_a11y: {
    message: "New Chat"
  },
  nav_loadHistory_a11y: {
    message: "Load History"
  },
  nav_settings_a11y: {
    message: "Settings"
  },
  nav_back: {
    message: "\u2190 Back"
  },
  nav_back_a11y: {
    message: "Back to chat"
  },
  welcome_title: {
    message: "Welcome to Nanobrowser!"
  },
  welcome_instruction: {
    message: "To get started, please configure your API keys in the settings page."
  },
  welcome_openSettings: {
    message: "Open Settings"
  },
  welcome_quickStart: {
    message: "Quick Start Guide"
  },
  welcome_joinCommunity: {
    message: "Join Our Community"
  },
  status_checkingConfig: {
    message: "Checking configuration..."
  },
  chat_buttons_stop: {
    message: "Stop"
  },
  chat_buttons_replay: {
    message: "Replay"
  },
  chat_buttons_send: {
    message: "Send"
  },
  chat_input_placeholder: {
    message: "What can I help you with?"
  },
  chat_input_form: {
    message: "Chat input form"
  },
  chat_input_editor: {
    message: "Message input"
  },
  chat_history_title: {
    message: "Chat History"
  },
  chat_history_empty: {
    message: "No chat history available"
  },
  chat_history_bookmark: {
    message: "Bookmark session"
  },
  chat_history_delete: {
    message: "Delete session"
  },
  chat_bookmarks_header: {
    message: "Quick Start"
  },
  chat_bookmarks_saveEdit: {
    message: "Save changes"
  },
  chat_bookmarks_cancelEdit: {
    message: "Cancel changes"
  },
  chat_bookmarks_edit: {
    message: "Edit bookmark title"
  },
  chat_bookmarks_delete: {
    message: "Delete bookmark"
  },
  chat_replay_starting: {
    message: 'Starting replay of task:\n\n"$TASK$"',
    placeholders: {
      task: {
        content: "$1",
        example: "Navigate to example.com"
      }
    }
  },
  chat_replay_failed: {
    message: "Replay failed: $ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Connection timeout"
      }
    }
  },
  chat_replay_invalidArgs: {
    message: "Invalid arguments. Please use the format: /replay <historySessionId>"
  },
  chat_replay_disabled: {
    message: 'Replay is disabled in general settings. Please enable "Replay Historical Tasks" in the extension settings to use this feature.'
  },
  chat_replay_noHistory: {
    message: `No action history found for session "$SESSION_ID$...". This session may not contain replayable actions.

It's a replay session itself (replay sessions cannot be replayed again), or it was created before the replay feature was available.`,
    placeholders: {
      session_id: {
        content: "$1",
        example: "abc123def456789"
      }
    }
  },
  chat_stt_processing: {
    message: "Processing speech..."
  },
  chat_stt_recording_stop: {
    message: "Stop recording"
  },
  chat_stt_input_start: {
    message: "Start voice input"
  },
  chat_stt_processingFailed: {
    message: "Failed to process speech recording"
  },
  chat_stt_model_notFound: {
    message: "No speech-to-text model configured or not a Gemini model. Please configure a Gemini model in settings."
  },
  chat_stt_recognitionFailed: {
    message: "Speech recognition failed"
  },
  chat_stt_microphone_permissionDenied: {
    message: "Microphone access denied. Please enable microphone permissions in browser settings."
  },
  chat_stt_microphone_accessFailed: {
    message: "Failed to access microphone. "
  },
  chat_stt_microphone_grantPermission: {
    message: "Please grant microphone permission."
  },
  chat_stt_microphone_notFound: {
    message: "No microphone found."
  },
  permissions_microphone_title: {
    message: "Enable Voice Input"
  },
  permissions_microphone_description: {
    message: "Nanobrowser needs microphone access to convert your speech to text."
  },
  permissions_microphone_grantButton: {
    message: "Grant Microphone Permission"
  },
  permissions_microphone_requesting: {
    message: "Requesting microphone permission..."
  },
  permissions_microphone_grantedSuccess: {
    message: "\u2705 Microphone permission granted! You can now use voice input."
  },
  permissions_microphone_grantedButton: {
    message: "Permission Granted"
  },
  permissions_microphone_denied: {
    message: "Permission denied. "
  },
  permissions_microphone_allowHelp: {
    message: 'Please click "Allow" when prompted for microphone access.'
  },
  permissions_microphone_notFound: {
    message: "No microphone found. Please check your audio devices."
  },
  permissions_microphone_alreadyGranted: {
    message: "\u2705 Microphone permission already granted!"
  },
  permissions_microphone_alreadyGrantedButton: {
    message: "Permission Already Granted"
  },
  options_nav_header: {
    message: "Settings"
  },
  options_tabs_general: {
    message: "General"
  },
  options_tabs_models: {
    message: "Models"
  },
  options_tabs_firewall: {
    message: "Firewall"
  },
  options_tabs_help: {
    message: "Help"
  },
  options_general_header: {
    message: "General"
  },
  options_general_maxSteps: {
    message: "Max Steps per Task"
  },
  options_general_maxSteps_desc: {
    message: "Step limit per task"
  },
  options_general_maxActions: {
    message: "Max Actions per Step"
  },
  options_general_maxActions_desc: {
    message: "Action limit per step"
  },
  options_general_maxFailures: {
    message: "Failure Tolerance"
  },
  options_general_maxFailures_desc: {
    message: "How many consecutive failures before stopping"
  },
  options_general_enableVision: {
    message: "Enable Vision"
  },
  options_general_enableVision_desc: {
    message: "Use vision capability of LLMs (consumes more tokens for better results)"
  },
  options_general_displayHighlights: {
    message: "Display Highlights"
  },
  options_general_displayHighlights_desc: {
    message: "Show visual highlights on interactive elements (e.g. buttons, links, etc.)"
  },
  options_general_planningInterval: {
    message: "Replanning Frequency"
  },
  options_general_planningInterval_desc: {
    message: "Reconsider and update the plan every [Number] steps"
  },
  options_general_minWaitPageLoad: {
    message: "Page Load Wait Time"
  },
  options_general_minWaitPageLoad_desc: {
    message: "Minimum wait time after page loads (250-5000ms)"
  },
  options_general_replayHistoricalTasks: {
    message: "Replay Historical Tasks( experimental )"
  },
  options_general_replayHistoricalTasks_desc: {
    message: "Enable storing and replaying of agent step history (experimental, may have issues)"
  },
  options_models_providers_header: {
    message: "LLM Providers"
  },
  options_models_providers_notConfigured: {
    message: "No providers configured yet. Add a provider to get started."
  },
  options_models_providers_btnCancel: {
    message: "Cancel"
  },
  options_models_providers_btnSave: {
    message: "Save"
  },
  options_models_providers_btnDelete: {
    message: "Delete"
  },
  options_models_providers_setupInstructions: {
    message: "Enter your API key and click Save to set it up."
  },
  options_models_providers_custom_name: {
    message: "Name"
  },
  options_models_providers_custom_name_desc: {
    message: "Provider name (spaces are not allowed when saving)"
  },
  options_models_providers_custom_name_placeholder: {
    message: "Provider name"
  },
  options_models_providers_apiKey: {
    message: "API Key"
  },
  options_models_providers_apiKey_placeholder_optional: {
    message: "API Key (optional)"
  },
  options_models_providers_apiKey_placeholder_required: {
    message: "API Key (required)"
  },
  options_models_providers_apiKey_placeholder_ollama: {
    message: "API Key (leave empty for Ollama)"
  },
  options_models_providers_apiKey_hide: {
    message: "Hide API key"
  },
  options_models_providers_apiKey_show: {
    message: "Show API key"
  },
  options_models_selection_header: {
    message: "Model Selection"
  },
  options_models_speechToText_header: {
    message: "Speech-to-Text Model"
  },
  options_models_agents_navigator: {
    message: "Navigates websites and performs actions"
  },
  options_models_agents_planner: {
    message: "Develops and refines strategies to complete tasks"
  },
  options_models_labels_model: {
    message: "Model"
  },
  options_models_labels_temperature: {
    message: "Temperature"
  },
  options_models_labels_topP: {
    message: "Top P"
  },
  options_models_labels_reasoning: {
    message: "Reasoning"
  },
  options_models_stt_desc: {
    message: "Configure the Gemini model used for converting speech to text when using the microphone feature."
  },
  options_models_chooseModel: {
    message: "Choose Model"
  },
  options_models_addNewProvider: {
    message: "Add New Provider"
  },
  options_models_providers_openaiCompatible: {
    message: "OpenAI-compatible API Provider"
  },
  options_models_providers_baseUrl: {
    message: "Base URL"
  },
  options_models_providers_endpoint: {
    message: "Endpoint"
  },
  options_models_providers_deployment: {
    message: "Deployment"
  },
  options_models_providers_apiVersion: {
    message: "API Version"
  },
  options_models_providers_models: {
    message: "Models"
  },
  options_models_providers_placeholders_baseUrl_custom: {
    message: "Required OpenAI-compatible API endpoint"
  },
  options_models_providers_placeholders_baseUrl_azure: {
    message: "https://YOUR_RESOURCE_NAME.openai.azure.com/"
  },
  options_models_providers_placeholders_baseUrl_openrouter: {
    message: "OpenRouter Base URL (optional, defaults to https://openrouter.ai/api/v1)"
  },
  options_models_providers_placeholders_baseUrl_llama: {
    message: "Llama API Base URL (defaults to https://api.llama.com/v1)"
  },
  options_models_providers_placeholders_baseUrl_ollama: {
    message: "Ollama base URL"
  },
  options_models_providers_placeholders_azureDeployment: {
    message: "Enter Azure model name (e.g. gpt-4o, gpt-4o-mini)"
  },
  options_models_providers_placeholders_azureApiVersion: {
    message: "e.g., 2025-04-01-preview"
  },
  options_models_providers_deployment_desc: {
    message: "Type model name and press Enter or Space to set. Deployment name should match OpenAI model name (e.g., gpt-4o) for best compatibility."
  },
  options_models_providers_models_instructions: {
    message: "Type and Press Enter or Space to add."
  },
  options_models_providers_models_openrouter_empty: {
    message: "No models selected. Add model names manually if needed."
  },
  options_models_providers_ollama_reminder: {
    message: "environment variable MUST be set for the Ollama server."
  },
  options_models_providers_ollama_learnMore: {
    message: "Learn more"
  },
  options_models_providers_errors_spacesNotAllowed: {
    message: "Spaces are not allowed in provider names. Please use underscores or other characters instead."
  },
  options_models_providers_errors_baseUrlRequired: {
    message: "Base URL is required for $PROVIDER$. Please enter it.",
    placeholders: {
      provider: {
        content: "$1",
        example: "Custom OpenAI"
      }
    }
  },
  options_firewall_header: {
    message: "Firewall"
  },
  options_firewall_enableToggle: {
    message: "Enable Firewall"
  },
  options_firewall_toggleFirewall_a11y: {
    message: "Toggle Firewall"
  },
  options_firewall_allowList_header: {
    message: "Allow List"
  },
  options_firewall_allowList_empty: {
    message: "No domains in allow list. Empty allow list means all non-denied domains are allowed."
  },
  options_firewall_denyList_header: {
    message: "Deny List"
  },
  options_firewall_denyList_empty: {
    message: "No domains in deny list"
  },
  options_firewall_placeholders_domainUrl: {
    message: "Enter domain or URL (e.g. example.com, localhost, 127.0.0.1)"
  },
  options_firewall_btnAdd: {
    message: "Add"
  },
  options_firewall_btnRemove: {
    message: "Remove"
  },
  options_firewall_howItWorks_header: {
    message: "How the Firewall Works"
  },
  options_firewall_howItWorks: {
    message: "The firewall contains a deny list and an allow list.\nIf both lists are empty, all URLs are allowed\nDeny list takes priority - if a URL matches any deny list entry, it's blocked\nWhen allow list is empty, all non-denied URLs are allowed\nWhen allow list is not empty, only matching URLs are allowed\nWildcards are NOT supported yet\nAllow list is preferred over deny list"
  },
  bg_errors_noTabId: {
    message: "No tab ID provided"
  },
  bg_errors_noTaskId: {
    message: "No task ID provided"
  },
  bg_errors_noRunningTask: {
    message: "No running task"
  },
  bg_cmd_newTask_noTask: {
    message: "No task provided"
  },
  bg_cmd_followUpTask_noTask: {
    message: "No follow up task provided"
  },
  bg_cmd_followUpTask_cleaned: {
    message: "Executor was cleaned up, can not add follow-up task"
  },
  bg_cmd_resumeTask_noTask: {
    message: "No task to resume"
  },
  bg_cmd_state_printed: {
    message: "State printed to console"
  },
  bg_cmd_state_failed: {
    message: "Failed to get state"
  },
  bg_cmd_nohighlight_ok: {
    message: "highlight removed"
  },
  bg_cmd_stt_noAudioData: {
    message: "No audio data provided"
  },
  bg_cmd_stt_failed: {
    message: "Speech recognition failed"
  },
  bg_cmd_replay_noHistory: {
    message: "No history session ID provided"
  },
  bg_cmd_replay_failed: {
    message: "Replay failed"
  },
  bg_setup_noApiKeys: {
    message: "Please configure API keys in the settings first"
  },
  bg_setup_noProvider: {
    message: "Provider $PROVIDER$ not found in the settings",
    placeholders: {
      provider: {
        content: "$1",
        example: "openai"
      }
    }
  },
  bg_setup_noNavigatorModel: {
    message: "Please choose a model for the navigator in the settings first"
  },
  exec_errors_maxStepsReached: {
    message: "Max steps reached"
  },
  exec_errors_maxFailuresReached: {
    message: "Max failures reached"
  },
  exec_task_cancel: {
    message: "Task cancelled"
  },
  exec_task_pause: {
    message: "Task paused"
  },
  exec_task_fail: {
    message: "Task failed: \n\n$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Connection timeout"
      }
    }
  },
  exec_replay_cancel: {
    message: "Replay cancelled"
  },
  exec_replay_ok: {
    message: "Replay completed"
  },
  exec_replay_fail: {
    message: "Replay failed: \n\n$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Network error"
      }
    }
  },
  exec_replay_historyNotFound: {
    message: "History not found"
  },
  exec_replay_historyEmpty: {
    message: "History is empty"
  },
  act_searchGoogle_start: {
    message: 'Searching for "$QUERY$" in Google',
    placeholders: {
      query: {
        content: "$1",
        example: "weather today"
      }
    }
  },
  act_searchGoogle_ok: {
    message: 'Searched for "$QUERY$" in Google',
    placeholders: {
      query: {
        content: "$1",
        example: "weather today"
      }
    }
  },
  act_goToUrl_start: {
    message: "Navigating to $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_goToUrl_ok: {
    message: "Navigated to $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_goBack_start: {
    message: "Navigating back"
  },
  act_goBack_ok: {
    message: "Navigated back"
  },
  act_wait_start: {
    message: "Waiting for $SECONDS$ seconds",
    placeholders: {
      seconds: {
        content: "$1",
        example: "3"
      }
    }
  },
  act_wait_ok: {
    message: "$SECONDS$ seconds elapsed",
    placeholders: {
      seconds: {
        content: "$1",
        example: "3"
      }
    }
  },
  act_click_start: {
    message: "Click element with index $INDEX$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_elementNotExist: {
    message: "Element with index $INDEX$ does not exist - retry or use alternative actions",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_elementNoLongerAvailable: {
    message: "Element no longer available with index $INDEX$ - most likely the page changed",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_click_fileUploader: {
    message: "Index $INDEX$ - has an element which opens file upload dialog. To upload files please use a specific function to upload files",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_click_ok: {
    message: "Clicked button with index $INDEX$: $TEXT$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      },
      text: {
        content: "$2",
        example: "Submit Button"
      }
    }
  },
  act_click_newTabOpened: {
    message: "New tab opened - switching to it"
  },
  act_inputText_start: {
    message: "Input text into index $INDEX$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_inputText_ok: {
    message: "Input $TEXT$ into index $INDEX$",
    placeholders: {
      text: {
        content: "$1",
        example: "Hello World"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_switchTab_start: {
    message: "Switching to tab $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_switchTab_ok: {
    message: "Switched to tab $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_openTab_start: {
    message: "Opening $URL$ in new tab",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_openTab_ok: {
    message: "Opened $URL$ in new tab",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_closeTab_start: {
    message: "Closing tab $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_closeTab_ok: {
    message: "Closed tab $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_cache_start: {
    message: "Caching findings: $CONTENT$",
    placeholders: {
      content: {
        content: "$1",
        example: "User preferences saved"
      }
    }
  },
  act_cache_ok: {
    message: "Cached findings: $CONTENT$",
    placeholders: {
      content: {
        content: "$1",
        example: "User preferences saved"
      }
    }
  },
  act_scrollToPercent_start: {
    message: "Scroll to percent: $PERCENT$",
    placeholders: {
      percent: {
        content: "$1",
        example: "50"
      }
    }
  },
  act_scrollToPercent_ok: {
    message: "Scrolled to percent: $PERCENT$",
    placeholders: {
      percent: {
        content: "$1",
        example: "50"
      }
    }
  },
  act_scrollToTop_start: {
    message: "Scroll to top"
  },
  act_scrollToTop_ok: {
    message: "Scrolled to top"
  },
  act_scrollToBottom_start: {
    message: "Scroll to bottom"
  },
  act_scrollToBottom_ok: {
    message: "Scrolled to bottom"
  },
  act_previousPage_start: {
    message: "Scroll to previous page"
  },
  act_previousPage_ok: {
    message: "Scrolled to previous page"
  },
  act_nextPage_start: {
    message: "Scroll to next page"
  },
  act_nextPage_ok: {
    message: "Scrolled to next page"
  },
  act_errors_alreadyAtTop: {
    message: "Element with index $INDEX$ is already at top, cannot scroll to previous page",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_pageAlreadyAtTop: {
    message: "Already at top of page, cannot scroll to previous page"
  },
  act_errors_alreadyAtBottom: {
    message: "Element with index $INDEX$ is already at bottom, cannot scroll to next page",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_pageAlreadyAtBottom: {
    message: "Already at bottom of page, cannot scroll to next page"
  },
  act_scrollToText_start: {
    message: "Scroll to text: $TEXT$, occurrence $OCCURRENCE$",
    placeholders: {
      text: {
        content: "$1",
        example: "Contact Us"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_ok: {
    message: "Scrolled to text: $TEXT$, occurrence $OCCURRENCE$",
    placeholders: {
      text: {
        content: "$1",
        example: "Contact Us"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_notFound: {
    message: "Text '$TEXT$' (occurrence $OCCURRENCE$) not found or not visible",
    placeholders: {
      text: {
        content: "$1",
        example: "Contact Us"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_failed: {
    message: "Failed to scroll to text: $ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Element not found"
      }
    }
  },
  act_sendKeys_start: {
    message: "Send keys: $KEYS$",
    placeholders: {
      keys: {
        content: "$1",
        example: "Enter"
      }
    }
  },
  act_sendKeys_ok: {
    message: "Sent keys: $KEYS$",
    placeholders: {
      keys: {
        content: "$1",
        example: "Enter"
      }
    }
  },
  act_getDropdownOptions_start: {
    message: "Getting options from dropdown with index $INDEX$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_getDropdownOptions_useExactText: {
    message: "Use the exact text string in select_dropdown_option"
  },
  act_getDropdownOptions_ok: {
    message: "Got $COUNT$ options from dropdown",
    placeholders: {
      count: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_getDropdownOptions_noOptions: {
    message: "No options found in dropdown"
  },
  act_getDropdownOptions_failed: {
    message: "Failed to get dropdown options: $ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Element not found"
      }
    }
  },
  act_selectDropdownOption_start: {
    message: 'Select option "$TEXT$" from dropdown with index $INDEX$',
    placeholders: {
      text: {
        content: "$1",
        example: "Option 1"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_selectDropdownOption_ok: {
    message: 'Selected option "$TEXT$" from dropdown with index $INDEX$',
    placeholders: {
      text: {
        content: "$1",
        example: "Option 1"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_selectDropdownOption_notSelect: {
    message: "Cannot select option: Element with index $INDEX$ is a $TAG_NAME$, not a SELECT",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      },
      tag_name: {
        content: "$2",
        example: "DIV"
      }
    }
  },
  act_selectDropdownOption_failed: {
    message: "Failed to select option: $ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Option not found"
      }
    }
  }
};

// locales/pt_BR/messages.json
var messages_default2 = {
  app_metadata_description: {
    description: "Descri\xE7\xE3o da extens\xE3o",
    message: "Automa\xE7\xE3o de navegador com IA! N-assistant ajuda voc\xEA a automatizar tarefas da web, extrair dados, preencher formul\xE1rios e muito mais."
  },
  app_metadata_name: {
    description: "Extension name",
    message: "N-assistant: Automa\xE7\xE3o Web com IA"
  },
  common_cancel: {
    message: "Cancelar"
  },
  common_submit: {
    message: "Enviar"
  },
  common_processing: {
    message: "Processando..."
  },
  exec_intent_clarification_default: {
    description: "Default clarification message when none provided",
    message: "Preciso de mais informa\xE7\xF5es para concluir esta tarefa com precis\xE3o. Por favor, forne\xE7a detalhes adicionais sobre o que voc\xEA quer que eu fa\xE7a."
  },
  exec_intent_clarification_needed: {
    description: "Mensagem de necessidade de esclarecimento de inten\xE7\xE3o",
    message: "Preciso de esclarecimento para ajudar voc\xEA melhor"
  },
  exec_intent_be_more_specific: {
    description: "Solicita\xE7\xE3o de descri\xE7\xE3o de tarefa mais espec\xEDfica",
    message: "Seja mais espec\xEDfico sobre o que voc\xEA quer que eu fa\xE7a"
  },
  exec_intent_provide_context: {
    description: "Solicita\xE7\xE3o de contexto adicional",
    message: "Forne\xE7a mais contexto sobre seu objetivo"
  },
  exec_intent_example_clarification: {
    description: "Exemplo de solicita\xE7\xE3o de esclarecimento",
    message: "Por exemplo: em vez de 'preencher o formul\xE1rio', diga 'preencher o formul\xE1rio de contato com nome Jo\xE3o Silva e email joao@exemplo.com'"
  },
  errors_unknown: {
    message: "Ocorreu um erro desconhecido"
  },
  errors_conn_serviceWorker: {
    message: "Falha ao conectar ao service worker"
  },
  errors_cmd_unknown: {
    message: "Comando n\xE3o suportado: $COMMAND$.\n\nComandos dispon\xEDveis: /state, /nohighlight, /replay <historySessionId>",
    placeholders: {
      command: {
        content: "$1",
        example: "/desconhecido"
      }
    }
  },
  nav_newChat_a11y: {
    message: "Novo Chat"
  },
  nav_loadHistory_a11y: {
    message: "Carregar Hist\xF3rico"
  },
  nav_settings_a11y: {
    message: "Configura\xE7\xF5es"
  },
  nav_back: {
    message: "\u2190 Voltar"
  },
  nav_back_a11y: {
    message: "Voltar para o chat"
  },
  welcome_title: {
    message: "Bem-vindo ao Nanobrowser!"
  },
  welcome_instruction: {
    message: "Para come\xE7ar, por favor, configure suas chaves de API na p\xE1gina de configura\xE7\xF5es."
  },
  welcome_openSettings: {
    message: "Abrir Configura\xE7\xF5es"
  },
  welcome_quickStart: {
    message: "Guia de In\xEDcio R\xE1pido"
  },
  welcome_joinCommunity: {
    message: "Junte-se \xE0 Nossa Comunidade"
  },
  status_checkingConfig: {
    message: "Verificando configura\xE7\xE3o..."
  },
  chat_buttons_stop: {
    message: "Parar"
  },
  chat_buttons_replay: {
    message: "Reproduzir"
  },
  chat_buttons_send: {
    message: "Enviar"
  },
  chat_input_placeholder: {
    message: "Como posso ajudar?"
  },
  chat_input_form: {
    message: "Formul\xE1rio de entrada de chat"
  },
  chat_input_editor: {
    message: "Entrada de mensagem"
  },
  chat_history_title: {
    message: "Hist\xF3rico de Chat"
  },
  chat_history_empty: {
    message: "Nenhum hist\xF3rico de chat dispon\xEDvel"
  },
  chat_history_bookmark: {
    message: "Adicionar sess\xE3o aos favoritos"
  },
  chat_history_delete: {
    message: "Excluir sess\xE3o"
  },
  chat_bookmarks_header: {
    message: "In\xEDcio R\xE1pido"
  },
  chat_bookmarks_saveEdit: {
    message: "Salvar altera\xE7\xF5es"
  },
  chat_bookmarks_cancelEdit: {
    message: "Cancelar altera\xE7\xF5es"
  },
  chat_bookmarks_edit: {
    message: "Editar t\xEDtulo do favorito"
  },
  chat_bookmarks_delete: {
    message: "Excluir favorito"
  },
  chat_replay_starting: {
    message: 'Iniciando reprodu\xE7\xE3o da tarefa:\n\n"$TASK$"',
    placeholders: {
      task: {
        content: "$1",
        example: "Navegar para example.com"
      }
    }
  },
  chat_replay_failed: {
    message: "Reprodu\xE7\xE3o falhou: $ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Tempo de conex\xE3o esgotado"
      }
    }
  },
  chat_replay_invalidArgs: {
    message: "Argumentos inv\xE1lidos. Por favor, use o formato: /replay <historySessionId>"
  },
  chat_replay_disabled: {
    message: 'A reprodu\xE7\xE3o est\xE1 desativada nas configura\xE7\xF5es gerais. Por favor, ative "Reproduzir Tarefas Hist\xF3ricas" nas configura\xE7\xF5es da extens\xE3o para usar este recurso.'
  },
  chat_replay_noHistory: {
    message: 'Nenhum hist\xF3rico de a\xE7\xE3o encontrado para a sess\xE3o "$SESSION_ID$".\n\n\xC9 uma sess\xE3o de reprodu\xE7\xE3o (sess\xF5es de reprodu\xE7\xE3o n\xE3o podem ser reproduzidas novamente), ou foi criada antes do recurso de reprodu\xE7\xE3o estar dispon\xEDvel.',
    placeholders: {
      session_id: {
        content: "$1",
        example: "abc123def456789"
      }
    }
  },
  chat_stt_processing: {
    message: "Processando fala..."
  },
  chat_stt_recording_stop: {
    message: "Parar grava\xE7\xE3o"
  },
  chat_stt_input_start: {
    message: "Iniciar entrada de voz"
  },
  chat_stt_processingFailed: {
    message: "Falha ao processar grava\xE7\xE3o de fala"
  },
  chat_stt_model_notFound: {
    message: "Nenhum modelo de convers\xE3o de fala para texto configurado ou n\xE3o \xE9 um modelo Gemini. Por favor, configure um modelo Gemini nas configura\xE7\xF5es."
  },
  chat_stt_recognitionFailed: {
    message: "Reconhecimento de fala falhou"
  },
  chat_stt_microphone_permissionDenied: {
    message: "Acesso ao microfone negado. Por favor, ative as permiss\xF5es de microfone nas configura\xE7\xF5es do navegador."
  },
  chat_stt_microphone_accessFailed: {
    message: "Falha ao acessar o microfone. "
  },
  chat_stt_microphone_grantPermission: {
    message: "Por favor, conceda permiss\xE3o ao microfone."
  },
  chat_stt_microphone_notFound: {
    message: "Nenhum microfone encontrado."
  },
  permissions_microphone_title: {
    message: "Ativar Entrada de Voz"
  },
  permissions_microphone_description: {
    message: "O Nanobrowser precisa de acesso ao microfone para converter sua fala em texto."
  },
  permissions_microphone_grantButton: {
    message: "Conceder Permiss\xE3o ao Microfone"
  },
  permissions_microphone_requesting: {
    message: "Solicitando permiss\xE3o de microfone..."
  },
  permissions_microphone_grantedSuccess: {
    message: "\u2705 Permiss\xE3o de microfone concedida! Agora voc\xEA pode usar a entrada de voz."
  },
  permissions_microphone_grantedButton: {
    message: "Permiss\xE3o Concedida"
  },
  permissions_microphone_denied: {
    message: "Permiss\xE3o negada. "
  },
  permissions_microphone_allowHelp: {
    message: 'Por favor, clique em "Permitir" quando solicitado o acesso ao microfone.'
  },
  permissions_microphone_notFound: {
    message: "Nenhum microfone encontrado. Por favor, verifique seus dispositivos de \xE1udio."
  },
  permissions_microphone_alreadyGranted: {
    message: "\u2705 Permiss\xE3o de microfone j\xE1 concedida!"
  },
  permissions_microphone_alreadyGrantedButton: {
    message: "Permiss\xE3o J\xE1 Concedida"
  },
  options_nav_header: {
    message: "Configura\xE7\xF5es"
  },
  options_tabs_general: {
    message: "Geral"
  },
  options_tabs_models: {
    message: "Modelos"
  },
  options_tabs_firewall: {
    message: "Firewall"
  },
  options_tabs_help: {
    message: "Ajuda"
  },
  options_general_header: {
    message: "Geral"
  },
  options_general_maxSteps: {
    message: "M\xE1ximo de Passos por Tarefa"
  },
  options_general_maxSteps_desc: {
    message: "Limite de passos por tarefa"
  },
  options_general_maxActions: {
    message: "M\xE1ximo de A\xE7\xF5es por Passo"
  },
  options_general_maxActions_desc: {
    message: "Limite de a\xE7\xF5es por passo"
  },
  options_general_maxFailures: {
    message: "Toler\xE2ncia a Falhas"
  },
  options_general_maxFailures_desc: {
    message: "Quantas falhas consecutivas antes de parar"
  },
  options_general_enableVision: {
    message: "Ativar Vis\xE3o"
  },
  options_general_enableVision_desc: {
    message: "Usar capacidade de vis\xE3o dos modelos de linguagem (consome mais tokens para melhores resultados)"
  },
  options_general_displayHighlights: {
    message: "Mostrar Destaques"
  },
  options_general_displayHighlights_desc: {
    message: "Mostrar destaques visuais em elementos interativos (ex: bot\xF5es, links, etc.)"
  },
  options_general_planningInterval: {
    message: "Frequ\xEAncia de Replanejamento"
  },
  options_general_planningInterval_desc: {
    message: "Reconsiderar e atualizar o plano a cada [N\xFAmero] passos"
  },
  options_general_minWaitPageLoad: {
    message: "Tempo de Espera de Carregamento da P\xE1gina"
  },
  options_general_minWaitPageLoad_desc: {
    message: "Tempo m\xEDnimo de espera ap\xF3s o carregamento da p\xE1gina (250-5000ms)"
  },
  options_general_replayHistoricalTasks: {
    message: "Reproduzir Tarefas Hist\xF3ricas (experimental)"
  },
  options_general_replayHistoricalTasks_desc: {
    message: "Ativar o armazenamento e a reprodu\xE7\xE3o do hist\xF3rico de passos do agente (experimental, pode ter problemas)"
  },
  options_models_providers_header: {
    message: "Provedores de LLM"
  },
  options_models_providers_notConfigured: {
    message: "Nenhum provedor configurado ainda. Adicione um provedor para come\xE7ar."
  },
  options_models_providers_btnCancel: {
    message: "Cancelar"
  },
  options_models_providers_btnSave: {
    message: "Salvar"
  },
  options_models_providers_btnDelete: {
    message: "Excluir"
  },
  options_models_providers_setupInstructions: {
    message: "Insira sua chave de API e clique em Salvar para configur\xE1-la."
  },
  options_models_providers_custom_name: {
    message: "Nome"
  },
  options_models_providers_custom_name_desc: {
    message: "Nome do provedor (espa\xE7os n\xE3o s\xE3o permitidos ao salvar)"
  },
  options_models_providers_custom_name_placeholder: {
    message: "Nome do provedor"
  },
  options_models_providers_apiKey: {
    message: "Chave de API"
  },
  options_models_providers_apiKey_placeholder_optional: {
    message: "Chave de API (opcional)"
  },
  options_models_providers_apiKey_placeholder_required: {
    message: "Chave de API (obrigat\xF3rio)"
  },
  options_models_providers_apiKey_placeholder_ollama: {
    message: "Chave de API (deixe em branco para Ollama)"
  },
  options_models_providers_apiKey_hide: {
    message: "Ocultar chave de API"
  },
  options_models_providers_apiKey_show: {
    message: "Mostrar chave de API"
  },
  options_models_selection_header: {
    message: "Sele\xE7\xE3o de Modelo"
  },
  options_models_speechToText_header: {
    message: "Modelo de Fala para Texto"
  },
  options_models_agents_navigator: {
    message: "Navega em sites e executa a\xE7\xF5es"
  },
  options_models_agents_planner: {
    message: "Desenvolve e refina estrat\xE9gias para completar tarefas"
  },
  options_models_labels_model: {
    message: "Modelo"
  },
  options_models_labels_temperature: {
    message: "Temperatura"
  },
  options_models_labels_topP: {
    message: "Top P"
  },
  options_models_labels_reasoning: {
    message: "Racioc\xEDnio"
  },
  options_models_stt_desc: {
    message: "Configure o modelo Gemini usado para converter fala em texto ao usar o recurso de microfone."
  },
  options_models_chooseModel: {
    message: "Escolher Modelo"
  },
  options_models_addNewProvider: {
    message: "Adicionar Novo Provedor"
  },
  options_models_providers_openaiCompatible: {
    message: "Provedor de API compat\xEDvel com OpenAI"
  },
  options_models_providers_baseUrl: {
    message: "URL Base"
  },
  options_models_providers_endpoint: {
    message: "Endpoint"
  },
  options_models_providers_deployment: {
    message: "Implanta\xE7\xE3o"
  },
  options_models_providers_apiVersion: {
    message: "Vers\xE3o da API"
  },
  options_models_providers_models: {
    message: "Modelos"
  },
  options_models_providers_placeholders_baseUrl_custom: {
    message: "Endpoint de API compat\xEDvel com OpenAI obrigat\xF3rio"
  },
  options_models_providers_placeholders_baseUrl_azure: {
    message: "https://SEU_NOME_DE_RECURSO.openai.azure.com/"
  },
  options_models_providers_placeholders_baseUrl_openrouter: {
    message: "URL Base do OpenRouter (opcional, padr\xE3o para https://openrouter.ai/api/v1)"
  },
  options_models_providers_placeholders_baseUrl_llama: {
    message: "URL Base da API Llama (padr\xE3o para https://api.llama.com/v1)"
  },
  options_models_providers_placeholders_baseUrl_ollama: {
    message: "URL base do Ollama"
  },
  options_models_providers_placeholders_azureDeployment: {
    message: "Insira o nome do modelo Azure (ex: gpt-4o, gpt-4o-mini)"
  },
  options_models_providers_placeholders_azureApiVersion: {
    message: "ex: 2025-04-01-preview"
  },
  options_models_providers_deployment_desc: {
    message: "Digite o nome do modelo e pressione Enter ou Espa\xE7o para definir. O nome da implanta\xE7\xE3o deve corresponder ao nome do modelo OpenAI (ex: gpt-4o) para melhor compatibilidade."
  },
  options_models_providers_models_instructions: {
    message: "Digite e pressione Enter ou Espa\xE7o para adicionar."
  },
  options_models_providers_models_openrouter_empty: {
    message: "Nenhum modelo selecionado. Adicione nomes de modelos manualmente, se necess\xE1rio."
  },
  options_models_providers_ollama_reminder: {
    message: "a vari\xE1vel de ambiente DEVE ser definida para o servidor Ollama."
  },
  options_models_providers_ollama_learnMore: {
    message: "Saiba mais"
  },
  options_models_providers_errors_spacesNotAllowed: {
    message: "Espa\xE7os n\xE3o s\xE3o permitidos em nomes de provedores. Por favor, use sublinhados ou outros caracteres."
  },
  options_models_providers_errors_baseUrlRequired: {
    message: "A URL Base \xE9 obrigat\xF3ria para $PROVIDER$. Por favor, insira-a.",
    placeholders: {
      provider: {
        content: "$1",
        example: "Custom OpenAI"
      }
    }
  },
  options_firewall_header: {
    message: "Firewall"
  },
  options_firewall_enableToggle: {
    message: "Ativar Firewall"
  },
  options_firewall_toggleFirewall_a11y: {
    message: "Ativar/Desativar Firewall"
  },
  options_firewall_allowList_header: {
    message: "Lista de Permiss\xF5es"
  },
  options_firewall_allowList_empty: {
    message: "Nenhum dom\xEDnio na lista de permiss\xF5es. Uma lista de permiss\xF5es vazia significa que todos os dom\xEDnios n\xE3o negados s\xE3o permitidos."
  },
  options_firewall_denyList_header: {
    message: "Lista de Nega\xE7\xF5es"
  },
  options_firewall_denyList_empty: {
    message: "Nenhum dom\xEDnio na lista de nega\xE7\xF5es"
  },
  options_firewall_placeholders_domainUrl: {
    message: "Insira dom\xEDnio ou URL (ex: example.com, localhost, 127.0.0.1)"
  },
  options_firewall_btnAdd: {
    message: "Adicionar"
  },
  options_firewall_btnRemove: {
    message: "Remover"
  },
  options_firewall_howItWorks_header: {
    message: "Como o Firewall Funciona"
  },
  options_firewall_howItWorks: {
    message: "O firewall cont\xE9m uma lista de nega\xE7\xF5es e uma lista de permiss\xF5es.\nSe ambas as listas estiverem vazias, todos os URLs s\xE3o permitidos\nA lista de nega\xE7\xF5es tem prioridade - se um URL corresponder a qualquer entrada da lista de nega\xE7\xF5es, ele ser\xE1 bloqueado\nQuando a lista de permiss\xF5es est\xE1 vazia, todos os URLs n\xE3o negados s\xE3o permitidos\nQuando a lista de permiss\xF5es n\xE3o est\xE1 vazia, apenas os URLs correspondentes s\xE3o permitidos\nCuringas ainda N\xC3O s\xE3o suportados\nA lista de permiss\xF5es \xE9 prefer\xEDvel \xE0 lista de nega\xE7\xF5es"
  },
  bg_errors_noTabId: {
    message: "Nenhum ID de aba fornecido"
  },
  bg_errors_noTaskId: {
    message: "Nenhum ID de tarefa fornecido"
  },
  bg_errors_noRunningTask: {
    message: "Nenhuma tarefa em execu\xE7\xE3o"
  },
  bg_cmd_newTask_noTask: {
    message: "Nenhuma tarefa fornecida"
  },
  bg_cmd_followUpTask_noTask: {
    message: "Nenhuma tarefa de acompanhamento fornecida"
  },
  bg_cmd_followUpTask_cleaned: {
    message: "O executor foi limpo, n\xE3o \xE9 poss\xEDvel adicionar tarefa de acompanhamento"
  },
  bg_cmd_resumeTask_noTask: {
    message: "Nenhuma tarefa para resumir"
  },
  bg_cmd_state_printed: {
    message: "Estado impresso no console"
  },
  bg_cmd_state_failed: {
    message: "Falha ao obter o estado"
  },
  bg_cmd_nohighlight_ok: {
    message: "destaque removido"
  },
  bg_cmd_stt_noAudioData: {
    message: "Nenhum dado de \xE1udio fornecido"
  },
  bg_cmd_stt_failed: {
    message: "Reconhecimento de fala falhou"
  },
  bg_cmd_replay_noHistory: {
    message: "Nenhum ID de sess\xE3o de hist\xF3rico fornecido"
  },
  bg_cmd_replay_failed: {
    message: "Reprodu\xE7\xE3o falhou"
  },
  bg_setup_noApiKeys: {
    message: "Por favor, configure as chaves de API nas configura\xE7\xF5es primeiro"
  },
  bg_setup_noProvider: {
    message: "Provedor $PROVIDER$ n\xE3o encontrado nas configura\xE7\xF5es",
    placeholders: {
      provider: {
        content: "$1",
        example: "openai"
      }
    }
  },
  bg_setup_noNavigatorModel: {
    message: "Por favor, escolha um modelo para o navegador nas configura\xE7\xF5es primeiro"
  },
  exec_errors_maxStepsReached: {
    message: "M\xE1ximo de passos atingido"
  },
  exec_errors_maxFailuresReached: {
    message: "M\xE1ximo de falhas atingido"
  },
  exec_task_cancel: {
    message: "Tarefa cancelada"
  },
  exec_task_pause: {
    message: "Tarefa pausada"
  },
  exec_task_fail: {
    message: "Tarefa falhou: \n\n$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Tempo de conex\xE3o esgotado"
      }
    }
  },
  exec_replay_cancel: {
    message: "Reprodu\xE7\xE3o cancelada"
  },
  exec_replay_ok: {
    message: "Reprodu\xE7\xE3o conclu\xEDda"
  },
  exec_replay_fail: {
    message: "Reprodu\xE7\xE3o falhou: \n\n$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Erro de rede"
      }
    }
  },
  exec_replay_historyNotFound: {
    message: "Hist\xF3rico n\xE3o encontrado"
  },
  exec_replay_historyEmpty: {
    message: "O hist\xF3rico est\xE1 vazio"
  },
  act_searchGoogle_start: {
    message: 'Procurando por "$QUERY$" no Google',
    placeholders: {
      query: {
        content: "$1",
        example: "clima hoje"
      }
    }
  },
  act_searchGoogle_ok: {
    message: 'Procurado por "$QUERY$" no Google',
    placeholders: {
      query: {
        content: "$1",
        example: "clima hoje"
      }
    }
  },
  act_goToUrl_start: {
    message: "Navegando para $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_goToUrl_ok: {
    message: "Navegado para $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_goBack_start: {
    message: "Navegando para tr\xE1s"
  },
  act_goBack_ok: {
    message: "Navegado para tr\xE1s"
  },
  act_wait_start: {
    message: "Aguardando $SECONDS$ segundos",
    placeholders: {
      seconds: {
        content: "$1",
        example: "3"
      }
    }
  },
  act_wait_ok: {
    message: "$SECONDS$ segundos se passaram",
    placeholders: {
      seconds: {
        content: "$1",
        example: "3"
      }
    }
  },
  act_click_start: {
    message: "Clicar no elemento com \xEDndice $INDEX$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_elementNotExist: {
    message: "Elemento com \xEDndice $INDEX$ n\xE3o existe - tente novamente ou use a\xE7\xF5es alternativas",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_elementNoLongerAvailable: {
    message: "Elemento n\xE3o est\xE1 mais dispon\xEDvel com o \xEDndice $INDEX$ - muito provavelmente a p\xE1gina mudou",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_click_fileUploader: {
    message: "\xCDndice $INDEX$ - possui um elemento que abre o di\xE1logo de upload de arquivo. Para fazer upload de arquivos, use uma fun\xE7\xE3o espec\xEDfica para upload de arquivos",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_click_ok: {
    message: "Bot\xE3o clicado com \xEDndice $INDEX$: $TEXT$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      },
      text: {
        content: "$2",
        example: "Bot\xE3o de Envio"
      }
    }
  },
  act_click_newTabOpened: {
    message: "Nova aba aberta - mudando para ela"
  },
  act_inputText_start: {
    message: "Inserir texto no \xEDndice $INDEX$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_inputText_ok: {
    message: "Inserir $TEXT$ no \xEDndice $INDEX$",
    placeholders: {
      text: {
        content: "$1",
        example: "Ol\xE1 Mundo"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_switchTab_start: {
    message: "Mudando para a aba $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_switchTab_ok: {
    message: "Mudou para a aba $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_openTab_start: {
    message: "Abrindo $URL$ em nova aba",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_openTab_ok: {
    message: "Abriu $URL$ em nova aba",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_closeTab_start: {
    message: "Fechando aba $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_closeTab_ok: {
    message: "Fechou aba $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_cache_start: {
    message: "Armazenando em cache os resultados: $CONTENT$",
    placeholders: {
      content: {
        content: "$1",
        example: "Prefer\xEAncias do usu\xE1rio salvas"
      }
    }
  },
  act_cache_ok: {
    message: "Resultados armazenados em cache: $CONTENT$",
    placeholders: {
      content: {
        content: "$1",
        example: "Prefer\xEAncias do usu\xE1rio salvas"
      }
    }
  },
  act_scrollToPercent_start: {
    message: "Rolar para a porcentagem: $PERCENT$",
    placeholders: {
      percent: {
        content: "$1",
        example: "50"
      }
    }
  },
  act_scrollToPercent_ok: {
    message: "Rolado para a porcentagem: $PERCENT$",
    placeholders: {
      percent: {
        content: "$1",
        example: "50"
      }
    }
  },
  act_scrollToTop_start: {
    message: "Rolar para o topo"
  },
  act_scrollToTop_ok: {
    message: "Rolado para o topo"
  },
  act_scrollToBottom_start: {
    message: "Rolar para o final"
  },
  act_scrollToBottom_ok: {
    message: "Rolado para o final"
  },
  act_previousPage_start: {
    message: "Rolar para a p\xE1gina anterior"
  },
  act_previousPage_ok: {
    message: "Rolado para a p\xE1gina anterior"
  },
  act_nextPage_start: {
    message: "Rolar para a pr\xF3xima p\xE1gina"
  },
  act_nextPage_ok: {
    message: "Rolado para a pr\xF3xima p\xE1gina"
  },
  act_errors_alreadyAtTop: {
    message: "O elemento com \xEDndice $INDEX$ j\xE1 est\xE1 no topo, n\xE3o \xE9 poss\xEDvel rolar para a p\xE1gina anterior",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_pageAlreadyAtTop: {
    message: "J\xE1 est\xE1 no topo da p\xE1gina, n\xE3o \xE9 poss\xEDvel rolar para a p\xE1gina anterior"
  },
  act_errors_alreadyAtBottom: {
    message: "O elemento com \xEDndice $INDEX$ j\xE1 est\xE1 no final, n\xE3o \xE9 poss\xEDvel rolar para a pr\xF3xima p\xE1gina",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_pageAlreadyAtBottom: {
    message: "J\xE1 est\xE1 no final da p\xE1gina, n\xE3o \xE9 poss\xEDvel rolar para a pr\xF3xima p\xE1gina"
  },
  act_scrollToText_start: {
    message: "Rolar para o texto: $TEXT$, ocorr\xEAncia $OCCURRENCE$",
    placeholders: {
      text: {
        content: "$1",
        example: "Fale Conosco"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_ok: {
    message: "Rolado para o texto: $TEXT$, ocorr\xEAncia $OCCURRENCE$",
    placeholders: {
      text: {
        content: "$1",
        example: "Fale Conosco"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_notFound: {
    message: "Texto '$TEXT$' (ocorr\xEAncia $OCCURRENCE$) n\xE3o encontrado ou n\xE3o vis\xEDvel",
    placeholders: {
      text: {
        content: "$1",
        example: "Fale Conosco"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_failed: {
    message: "Falha ao rolar para o texto: $ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Elemento n\xE3o encontrado"
      }
    }
  },
  act_sendKeys_start: {
    message: "Enviar teclas: $KEYS$",
    placeholders: {
      keys: {
        content: "$1",
        example: "Enter"
      }
    }
  },
  act_sendKeys_ok: {
    message: "Teclas enviadas: $KEYS$",
    placeholders: {
      keys: {
        content: "$1",
        example: "Enter"
      }
    }
  },
  act_getDropdownOptions_start: {
    message: "Obtendo op\xE7\xF5es do menu suspenso com \xEDndice $INDEX$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_getDropdownOptions_useExactText: {
    message: "Use a string de texto exata em select_dropdown_option"
  },
  act_getDropdownOptions_ok: {
    message: "Obtidas $COUNT$ op\xE7\xF5es do menu suspenso",
    placeholders: {
      count: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_getDropdownOptions_noOptions: {
    message: "Nenhuma op\xE7\xE3o encontrada no menu suspenso"
  },
  act_getDropdownOptions_failed: {
    message: "Falha ao obter op\xE7\xF5es do menu suspenso: $ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Elemento n\xE3o encontrado"
      }
    }
  },
  act_selectDropdownOption_start: {
    message: 'Selecionar op\xE7\xE3o "$TEXT$" do menu suspenso com \xEDndice $INDEX$',
    placeholders: {
      text: {
        content: "$1",
        example: "Op\xE7\xE3o 1"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_selectDropdownOption_ok: {
    message: 'Op\xE7\xE3o selecionada "$TEXT$" do menu suspenso com \xEDndice $INDEX$',
    placeholders: {
      text: {
        content: "$1",
        example: "Op\xE7\xE3o 1"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_selectDropdownOption_notSelect: {
    message: "N\xE3o \xE9 poss\xEDvel selecionar a op\xE7\xE3o: O elemento com \xEDndice $INDEX$ \xE9 um $TAG_NAME$, n\xE3o um SELECT",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      },
      tag_name: {
        content: "$2",
        example: "DIV"
      }
    }
  },
  act_selectDropdownOption_failed: {
    message: "Falha ao selecionar a op\xE7\xE3o: $ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Op\xE7\xE3o n\xE3o encontrada"
      }
    }
  }
};

// locales/zh_TW/messages.json
var messages_default3 = {
  app_metadata_description: {
    description: "Extension description",
    message: "AI \u9A45\u52D5\u7684\u700F\u89BD\u5668\u81EA\u52D5\u5316\uFF01N-assistant \u5354\u52A9\u60A8\u81EA\u52D5\u5316\u7DB2\u9801\u4EFB\u52D9\u3001\u64F7\u53D6\u8CC7\u6599\u3001\u586B\u5BEB\u8868\u55AE\u7B49\u3002"
  },
  app_metadata_name: {
    description: "Extension name",
    message: "N-assistant\uFF1AAI \u7DB2\u9801\u81EA\u52D5\u5316"
  },
  common_cancel: {
    message: "\u53D6\u6D88"
  },
  common_submit: {
    message: "\u63D0\u4EA4"
  },
  common_processing: {
    message: "\u8655\u7406\u4E2D..."
  },
  exec_intent_clarification_default: {
    description: "Default clarification message when none provided",
    message: "\u6211\u9700\u8981\u66F4\u591A\u8CC7\u8A0A\u624D\u80FD\u6E96\u78BA\u5B8C\u6210\u6B64\u4EFB\u52D9\u3002\u8ACB\u63D0\u4F9B\u95DC\u65BC\u60A8\u5E0C\u671B\u6211\u505A\u4EC0\u9EBC\u7684\u984D\u5916\u7D30\u7BC0\u3002"
  },
  exec_intent_clarification_needed: {
    description: "Intent clarification needed message",
    message: "\u6211\u9700\u8981\u66F4\u591A\u6F84\u6E05\u4F86\u66F4\u597D\u5730\u5E6B\u52A9\u60A8"
  },
  exec_intent_be_more_specific: {
    description: "Request for more specific task description",
    message: "\u8ACB\u66F4\u5177\u9AD4\u8AAA\u660E\u60A8\u5E0C\u671B\u6211\u505A\u4EC0\u9EBC"
  },
  exec_intent_provide_context: {
    description: "Request for additional context",
    message: "\u63D0\u4F9B\u66F4\u591A\u95DC\u65BC\u60A8\u76EE\u6A19\u7684\u80CC\u666F\u8CC7\u8A0A"
  },
  exec_intent_example_clarification: {
    description: "Example of clarification request",
    message: "\u4F8B\u5982\uFF1A\u4E0D\u8981\u8AAA\u300C\u586B\u5BEB\u8868\u55AE\u300D\uFF0C\u8ACB\u8AAA\u300C\u7528\u59D3\u540D\u5F35\u4E09\u548C\u90F5\u7BB1 zhang@example.com \u586B\u5BEB\u806F\u7E6B\u8868\u55AE\u300D"
  },
  errors_unknown: {
    message: "\u767C\u751F\u672A\u77E5\u932F\u8AA4"
  },
  errors_conn_serviceWorker: {
    message: "\u9023\u7DDA\u81F3 Service Worker \u5931\u6557"
  },
  errors_cmd_unknown: {
    message: "\u4E0D\u652F\u63F4\u7684\u6307\u4EE4\uFF1A$COMMAND$\u3002\n\n\u53EF\u7528\u6307\u4EE4\uFF1A/state\u3001/nohighlight\u3001/replay <historySessionId>",
    placeholders: {
      command: {
        content: "$1",
        example: "/unknown"
      }
    }
  },
  nav_newChat_a11y: {
    message: "\u65B0\u5C0D\u8A71"
  },
  nav_loadHistory_a11y: {
    message: "\u8F09\u5165\u6B77\u53F2\u7D00\u9304"
  },
  nav_settings_a11y: {
    message: "\u8A2D\u5B9A"
  },
  nav_back: {
    message: "\u2190 \u8FD4\u56DE"
  },
  nav_back_a11y: {
    message: "\u56DE\u5230\u5C0D\u8A71"
  },
  welcome_title: {
    message: "\u6B61\u8FCE\u4F7F\u7528 Nanobrowser\uFF01"
  },
  welcome_instruction: {
    message: "\u958B\u59CB\u4F7F\u7528\u524D\uFF0C\u8ACB\u5148\u5B8C\u6210 API \u91D1\u9470\u7684\u8A2D\u5B9A\u3002"
  },
  welcome_openSettings: {
    message: "\u958B\u555F\u8A2D\u5B9A"
  },
  welcome_quickStart: {
    message: "\u5FEB\u901F\u5165\u9580\u6307\u5357"
  },
  welcome_joinCommunity: {
    message: "\u52A0\u5165\u6211\u5011\u7684\u793E\u7FA4"
  },
  status_checkingConfig: {
    message: "\u6B63\u5728\u6AA2\u67E5\u8A2D\u5B9A..."
  },
  chat_buttons_stop: {
    message: "\u505C\u6B62"
  },
  chat_buttons_replay: {
    message: "\u91CD\u64AD"
  },
  chat_buttons_send: {
    message: "\u50B3\u9001"
  },
  chat_input_placeholder: {
    message: "\u6709\u4EC0\u9EBC\u9700\u8981\u5354\u52A9\u7684\u55CE\uFF1F"
  },
  chat_input_form: {
    message: "\u5C0D\u8A71\u8F38\u5165\u8868\u55AE"
  },
  chat_input_editor: {
    message: "\u8A0A\u606F\u8F38\u5165"
  },
  chat_history_title: {
    message: "\u5C0D\u8A71\u6B77\u53F2\u7D00\u9304"
  },
  chat_history_empty: {
    message: "\u6C92\u6709\u53EF\u7528\u7684\u5C0D\u8A71\u6B77\u53F2\u7D00\u9304"
  },
  chat_history_bookmark: {
    message: "\u5C07\u5DE5\u4F5C\u968E\u6BB5\u52A0\u5165\u66F8\u7C64"
  },
  chat_history_delete: {
    message: "\u522A\u9664\u5DE5\u4F5C\u968E\u6BB5"
  },
  chat_bookmarks_header: {
    message: "\u5FEB\u901F\u5165\u9580"
  },
  chat_bookmarks_saveEdit: {
    message: "\u5132\u5B58\u8B8A\u66F4"
  },
  chat_bookmarks_cancelEdit: {
    message: "\u53D6\u6D88\u8B8A\u66F4"
  },
  chat_bookmarks_edit: {
    message: "\u7DE8\u8F2F\u66F8\u7C64\u6A19\u984C"
  },
  chat_bookmarks_delete: {
    message: "\u522A\u9664\u66F8\u7C64"
  },
  chat_replay_starting: {
    message: '\u958B\u59CB\u91CD\u64AD\u4EFB\u52D9\uFF1A\n\n"$TASK$"',
    placeholders: {
      task: {
        content: "$1",
        example: "Navigate to example.com"
      }
    }
  },
  chat_replay_failed: {
    message: "\u91CD\u64AD\u5931\u6557\uFF1A$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Connection timeout"
      }
    }
  },
  chat_replay_invalidArgs: {
    message: "\u53C3\u6578\u7121\u6548\u3002\u8ACB\u4F7F\u7528\u6B64\u683C\u5F0F\uFF1A/replay <historySessionId>"
  },
  chat_replay_disabled: {
    message: '\u91CD\u64AD\u529F\u80FD\u5DF2\u5728\u4E00\u822C\u8A2D\u5B9A\u4E2D\u505C\u7528\u3002\u8ACB\u5728\u64F4\u5145\u529F\u80FD\u7684\u8A2D\u5B9A\u4E2D\u555F\u7528 "\u91CD\u64AD\u6B77\u53F2\u4EFB\u52D9" \u4EE5\u4F7F\u7528\u6B64\u529F\u80FD\u3002'
  },
  chat_replay_noHistory: {
    message: '\u627E\u4E0D\u5230\u5DE5\u4F5C\u968E\u6BB5 "$SESSION_ID$..." \u7684\u64CD\u4F5C\u6B77\u53F2\u7D00\u9304\u3002\u6B64\u5DE5\u4F5C\u968E\u6BB5\u53EF\u80FD\u672A\u5305\u542B\u53EF\u91CD\u64AD\u7684\u64CD\u4F5C\u3002\n\n\u9019\u53EF\u80FD\u662F\u56E0\u70BA\u5B83\u672C\u8EAB\u5C31\u662F\u4E00\u500B\u91CD\u64AD\u5DE5\u4F5C\u968E\u6BB5 (\u91CD\u64AD\u5DE5\u4F5C\u968E\u6BB5\u7121\u6CD5\u518D\u6B21\u91CD\u64AD)\uFF0C\u6216\u662F\u5728\u6B64\u529F\u80FD\u63A8\u51FA\u4E4B\u524D\u6240\u5EFA\u7ACB\u7684\u3002',
    placeholders: {
      session_id: {
        content: "$1",
        example: "abc123def456789"
      }
    }
  },
  chat_stt_processing: {
    message: "\u6B63\u5728\u8655\u7406\u8A9E\u97F3..."
  },
  chat_stt_recording_stop: {
    message: "\u505C\u6B62\u9304\u97F3"
  },
  chat_stt_input_start: {
    message: "\u958B\u59CB\u8A9E\u97F3\u8F38\u5165"
  },
  chat_stt_processingFailed: {
    message: "\u8655\u7406\u8A9E\u97F3\u8F38\u5165\u5931\u6557"
  },
  chat_stt_model_notFound: {
    message: "\u5C1A\u672A\u8A2D\u5B9A\u8A9E\u97F3\u8F49\u6587\u5B57\u6A21\u578B\uFF0C\u6216\u6240\u9078\u64C7\u7684\u4E0D\u662F Gemini \u6A21\u578B\u3002\u8ACB\u5728\u8A2D\u5B9A\u4E2D\u9078\u64C7 Gemini \u6A21\u578B\u3002"
  },
  chat_stt_recognitionFailed: {
    message: "\u8A9E\u97F3\u8FA8\u8B58\u5931\u6557"
  },
  chat_stt_microphone_permissionDenied: {
    message: "\u9EA5\u514B\u98A8\u5B58\u53D6\u906D\u62D2\u3002\u8ACB\u5728\u700F\u89BD\u5668\u8A2D\u5B9A\u4E2D\u555F\u7528\u9EA5\u514B\u98A8\u6B0A\u9650\u3002"
  },
  chat_stt_microphone_accessFailed: {
    message: "\u7121\u6CD5\u5B58\u53D6\u9EA5\u514B\u98A8\u3002"
  },
  chat_stt_microphone_grantPermission: {
    message: "\u8ACB\u6388\u4E88\u9EA5\u514B\u98A8\u6B0A\u9650\u3002"
  },
  chat_stt_microphone_notFound: {
    message: "\u627E\u4E0D\u5230\u9EA5\u514B\u98A8\u3002"
  },
  permissions_microphone_title: {
    message: "\u555F\u7528\u8A9E\u97F3\u8F38\u5165"
  },
  permissions_microphone_description: {
    message: "Nanobrowser \u9700\u8981\u9EA5\u514B\u98A8\u5B58\u53D6\u6B0A\u9650\uFF0C\u624D\u80FD\u5C07\u8A9E\u97F3\u8F49\u63DB\u70BA\u6587\u5B57\u3002"
  },
  permissions_microphone_grantButton: {
    message: "\u6388\u4E88\u9EA5\u514B\u98A8\u6B0A\u9650"
  },
  permissions_microphone_requesting: {
    message: "\u6B63\u5728\u8ACB\u6C42\u9EA5\u514B\u98A8\u6B0A\u9650..."
  },
  permissions_microphone_grantedSuccess: {
    message: "\u2705 \u5DF2\u6388\u4E88\u9EA5\u514B\u98A8\u6B0A\u9650\uFF01\u60A8\u73FE\u5728\u53EF\u4EE5\u4F7F\u7528\u8A9E\u97F3\u8F38\u5165\u4E86\u3002"
  },
  permissions_microphone_grantedButton: {
    message: "\u5DF2\u6388\u4E88\u6B0A\u9650"
  },
  permissions_microphone_denied: {
    message: "\u6B0A\u9650\u906D\u62D2\u3002"
  },
  permissions_microphone_allowHelp: {
    message: '\u7576\u7CFB\u7D71\u63D0\u793A\u6388\u4E88\u9EA5\u514B\u98A8\u5B58\u53D6\u6B0A\u9650\u6642\uFF0C\u8ACB\u9EDE\u9078 "\u5141\u8A31" \u3002'
  },
  permissions_microphone_notFound: {
    message: "\u627E\u4E0D\u5230\u9EA5\u514B\u98A8\u3002\u8ACB\u6AA2\u67E5\u60A8\u7684\u97F3\u8A0A\u88DD\u7F6E\u3002"
  },
  permissions_microphone_alreadyGranted: {
    message: "\u2705 \u5DF2\u6388\u4E88\u9EA5\u514B\u98A8\u6B0A\u9650\uFF01"
  },
  permissions_microphone_alreadyGrantedButton: {
    message: "\u5DF2\u6388\u4E88\u6B0A\u9650"
  },
  options_nav_header: {
    message: "\u8A2D\u5B9A"
  },
  options_tabs_general: {
    message: "\u4E00\u822C"
  },
  options_tabs_models: {
    message: "\u6A21\u578B"
  },
  options_tabs_firewall: {
    message: "\u9632\u706B\u7246"
  },
  options_tabs_help: {
    message: "\u8AAA\u660E"
  },
  options_general_header: {
    message: "\u4E00\u822C"
  },
  options_general_maxSteps: {
    message: "\u55AE\u4E00\u4EFB\u52D9\u7684\u6B65\u9A5F\u4E0A\u9650"
  },
  options_general_maxSteps_desc: {
    message: "\u9650\u5236\u55AE\u4E00\u4EFB\u52D9\u7684\u6B65\u9A5F\u6578\u91CF"
  },
  options_general_maxActions: {
    message: "\u55AE\u4E00\u6B65\u9A5F\u7684\u52D5\u4F5C\u4E0A\u9650"
  },
  options_general_maxActions_desc: {
    message: "\u9650\u5236\u55AE\u4E00\u6B65\u9A5F\u7684\u52D5\u4F5C\u6578\u91CF"
  },
  options_general_maxFailures: {
    message: "\u9023\u7E8C\u5931\u6557\u5BB9\u8A31\u6B21\u6578"
  },
  options_general_maxFailures_desc: {
    message: "\u5728\u505C\u6B62\u57F7\u884C\u524D\uFF0C\u53EF\u5BB9\u8A31\u7684\u9023\u7E8C\u5931\u6557\u6B21\u6578"
  },
  options_general_enableVision: {
    message: "\u555F\u7528\u8996\u89BA\u80FD\u529B"
  },
  options_general_enableVision_desc: {
    message: "\u4F7F\u7528\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u7684\u8996\u89BA\u80FD\u529B (\u5C07\u6703\u6D88\u8017\u66F4\u591A\u7684 token \u4EE5\u53D6\u5F97\u66F4\u597D\u7684\u7D50\u679C)"
  },
  options_general_displayHighlights: {
    message: "\u986F\u793A\u9192\u76EE\u6A19\u793A"
  },
  options_general_displayHighlights_desc: {
    message: "\u5728\u53EF\u4E92\u52D5\u7684\u5143\u7D20 (\u5982\u6309\u9215\u3001\u9023\u7D50\u7B49) \u4E0A\u986F\u793A\u8996\u89BA\u5316\u9192\u76EE\u6A19\u793A"
  },
  options_general_planningInterval: {
    message: "\u91CD\u65B0\u898F\u5283\u983B\u7387"
  },
  options_general_planningInterval_desc: {
    message: "\u6BCF\u9694 [Number] \u500B\u6B65\u9A5F\u91CD\u65B0\u8A55\u4F30\u4E26\u66F4\u65B0\u8A08\u756B"
  },
  options_general_minWaitPageLoad: {
    message: "\u9801\u9762\u8F09\u5165\u7B49\u5019\u6642\u9593"
  },
  options_general_minWaitPageLoad_desc: {
    message: "\u9801\u9762\u8F09\u5165\u5F8C\u7684\u6700\u77ED\u7B49\u5019\u6642\u9593 (250-5000 \u6BEB\u79D2)"
  },
  options_general_replayHistoricalTasks: {
    message: "\u91CD\u64AD\u6B77\u53F2\u4EFB\u52D9\uFF08\u5BE6\u9A57\u6027\u529F\u80FD\uFF09"
  },
  options_general_replayHistoricalTasks_desc: {
    message: "\u555F\u7528\u5132\u5B58\u8207\u91CD\u64AD\u4EE3\u7406\u7A0B\u5F0F\u7684\u6B65\u9A5F\u6B77\u53F2\u7D00\u9304 (\u6B64\u70BA\u5BE6\u9A57\u6027\u529F\u80FD\uFF0C\u53EF\u80FD\u5B58\u5728\u554F\u984C)"
  },
  options_models_providers_header: {
    message: "LLM \u63D0\u4F9B\u8005"
  },
  options_models_providers_notConfigured: {
    message: "\u5C1A\u672A\u8A2D\u5B9A\u4EFB\u4F55\u63D0\u4F9B\u8005\u3002\u8ACB\u65B0\u589E\u4E00\u500B\u63D0\u4F9B\u8005\u4EE5\u958B\u59CB\u4F7F\u7528\u3002"
  },
  options_models_providers_btnCancel: {
    message: "\u53D6\u6D88"
  },
  options_models_providers_btnSave: {
    message: "\u5132\u5B58"
  },
  options_models_providers_btnDelete: {
    message: "\u522A\u9664"
  },
  options_models_providers_setupInstructions: {
    message: "\u8ACB\u8F38\u5165\u60A8\u7684 API \u91D1\u9470\uFF0C\u7136\u5F8C\u9EDE\u9078 [\u5132\u5B58] \u9032\u884C\u8A2D\u5B9A\u3002"
  },
  options_models_providers_custom_name: {
    message: "\u540D\u7A31"
  },
  options_models_providers_custom_name_desc: {
    message: "\u63D0\u4F9B\u8005\u540D\u7A31 (\u5132\u5B58\u6642\u4E0D\u5141\u8A31\u4F7F\u7528\u7A7A\u683C)"
  },
  options_models_providers_custom_name_placeholder: {
    message: "\u63D0\u4F9B\u8005\u540D\u7A31"
  },
  options_models_providers_apiKey: {
    message: "API \u91D1\u9470"
  },
  options_models_providers_apiKey_placeholder_optional: {
    message: "API \u91D1\u9470 (\u9078\u586B)"
  },
  options_models_providers_apiKey_placeholder_required: {
    message: "API \u91D1\u9470 (\u5FC5\u586B)"
  },
  options_models_providers_apiKey_placeholder_ollama: {
    message: "API \u91D1\u9470 (Ollama \u53EF\u7559\u7A7A)"
  },
  options_models_providers_apiKey_hide: {
    message: "\u96B1\u85CF API \u91D1\u9470"
  },
  options_models_providers_apiKey_show: {
    message: "\u986F\u793A API \u91D1\u9470"
  },
  options_models_selection_header: {
    message: "\u6A21\u578B\u9078\u64C7"
  },
  options_models_speechToText_header: {
    message: "\u8A9E\u97F3\u8F49\u6587\u5B57\u6A21\u578B"
  },
  options_models_agents_navigator: {
    message: "\u700F\u89BD\u7DB2\u7AD9\u4E26\u57F7\u884C\u64CD\u4F5C"
  },
  options_models_agents_planner: {
    message: "\u5236\u5B9A\u4E26\u8ABF\u6574\u7B56\u7565\u4EE5\u5B8C\u6210\u4EFB\u52D9"
  },
  options_models_labels_model: {
    message: "\u6A21\u578B"
  },
  options_models_labels_temperature: {
    message: "\u6EAB\u5EA6"
  },
  options_models_labels_topP: {
    message: "Top P"
  },
  options_models_labels_reasoning: {
    message: "\u63A8\u7406"
  },
  options_models_stt_desc: {
    message: "\u8A2D\u5B9A\u5728\u4F7F\u7528\u9EA5\u514B\u98A8\u529F\u80FD\u6642\uFF0C\u5C07\u8A9E\u97F3\u8F49\u63DB\u70BA\u6587\u5B57\u6240\u4F7F\u7528\u7684 Gemini \u6A21\u578B\u3002"
  },
  options_models_chooseModel: {
    message: "\u9078\u64C7\u6A21\u578B"
  },
  options_models_addNewProvider: {
    message: "\u65B0\u589E\u63D0\u4F9B\u8005"
  },
  options_models_providers_openaiCompatible: {
    message: "\u8207 OpenAI \u76F8\u5BB9\u7684 API \u63D0\u4F9B\u8005"
  },
  options_models_providers_baseUrl: {
    message: "\u57FA\u790E URL"
  },
  options_models_providers_endpoint: {
    message: "\u7AEF\u9EDE"
  },
  options_models_providers_deployment: {
    message: "\u90E8\u7F72"
  },
  options_models_providers_apiVersion: {
    message: "API \u7248\u672C"
  },
  options_models_providers_models: {
    message: "\u6A21\u578B"
  },
  options_models_providers_placeholders_baseUrl_custom: {
    message: "\u5FC5\u9808\u63D0\u4F9B\u8207 OpenAI \u76F8\u5BB9\u7684 API \u7AEF\u9EDE"
  },
  options_models_providers_placeholders_baseUrl_azure: {
    message: "https://YOUR_RESOURCE_NAME.openai.azure.com/"
  },
  options_models_providers_placeholders_baseUrl_openrouter: {
    message: "OpenRouter \u57FA\u790E URL (\u9078\u586B\uFF0C\u9810\u8A2D\u70BA https://openrouter.ai/api/v1)"
  },
  options_models_providers_placeholders_baseUrl_llama: {
    message: "Llama API \u57FA\u790E URL (\u9810\u8A2D\u70BA https://api.llama.com/v1)"
  },
  options_models_providers_placeholders_baseUrl_ollama: {
    message: "Ollama \u57FA\u790E URL"
  },
  options_models_providers_placeholders_azureDeployment: {
    message: "\u8ACB\u8F38\u5165 Azure \u6A21\u578B\u7684\u90E8\u7F72\u540D\u7A31 (\u4F8B\u5982 gpt-4o, gpt-4o-mini)"
  },
  options_models_providers_placeholders_azureApiVersion: {
    message: "\u4F8B\u5982\uFF1A2025-04-01-preview"
  },
  options_models_providers_deployment_desc: {
    message: "\u8F38\u5165\u6A21\u578B\u540D\u7A31\u5F8C\uFF0C\u6309\u4E0B Enter \u6216\u7A7A\u683C\u9375\u4EE5\u5B8C\u6210\u8A2D\u5B9A\u3002\u70BA\u7372\u5F97\u6700\u4F73\u7684\u76F8\u5BB9\u6027\uFF0C\u90E8\u7F72\u540D\u7A31\u5EFA\u8B70\u8207 OpenAI \u7684\u6A21\u578B\u540D\u7A31 (\u4F8B\u5982 gpt-4o) \u4FDD\u6301\u4E00\u81F4\u3002"
  },
  options_models_providers_models_instructions: {
    message: "\u8F38\u5165\u5F8C\u6309\u4E0B Enter \u6216\u7A7A\u683C\u9375\u4EE5\u65B0\u589E\u3002"
  },
  options_models_providers_models_openrouter_empty: {
    message: "\u672A\u9078\u64C7\u4EFB\u4F55\u6A21\u578B\u3002\u5982\u6709\u9700\u8981\uFF0C\u8ACB\u624B\u52D5\u65B0\u589E\u6A21\u578B\u540D\u7A31\u3002"
  },
  options_models_providers_ollama_reminder: {
    message: "\u8ACB\u52D9\u5FC5\u70BA Ollama \u4F3A\u670D\u5668\u8A2D\u5B9A\u74B0\u5883\u8B8A\u6578\u3002"
  },
  options_models_providers_ollama_learnMore: {
    message: "\u6DF1\u5165\u77AD\u89E3"
  },
  options_models_providers_errors_spacesNotAllowed: {
    message: "\u63D0\u4F9B\u8005\u540D\u7A31\u4E0D\u5141\u8A31\u4F7F\u7528\u7A7A\u683C\u3002\u8ACB\u6539\u7528\u5E95\u7DDA\u6216\u5176\u4ED6\u5B57\u5143\u3002"
  },
  options_models_providers_errors_baseUrlRequired: {
    message: "\u5FC5\u9808\u70BA $PROVIDER$ \u63D0\u4F9B\u57FA\u790E URL\uFF0C\u8ACB\u624B\u52D5\u8F38\u5165\u3002",
    placeholders: {
      provider: {
        content: "$1",
        example: "Custom OpenAI"
      }
    }
  },
  options_firewall_header: {
    message: "\u9632\u706B\u7246"
  },
  options_firewall_enableToggle: {
    message: "\u555F\u7528\u9632\u706B\u7246"
  },
  options_firewall_toggleFirewall_a11y: {
    message: "\u5207\u63DB\u9632\u706B\u7246"
  },
  options_firewall_allowList_header: {
    message: "\u5141\u8A31\u6E05\u55AE"
  },
  options_firewall_allowList_empty: {
    message: "\u5141\u8A31\u6E05\u55AE\u4E2D\u6C92\u6709\u7DB2\u57DF\u3002\u82E5\u5141\u8A31\u6E05\u55AE\u70BA\u7A7A\uFF0C\u5247\u8868\u793A\u6240\u6709\u672A\u5728\u62D2\u7D55\u6E05\u55AE\u4E2D\u7684\u7DB2\u57DF\u90FD\u5C07\u88AB\u5141\u8A31\u3002"
  },
  options_firewall_denyList_header: {
    message: "\u62D2\u7D55\u6E05\u55AE"
  },
  options_firewall_denyList_empty: {
    message: "\u62D2\u7D55\u6E05\u55AE\u4E2D\u6C92\u6709\u7DB2\u57DF"
  },
  options_firewall_placeholders_domainUrl: {
    message: "\u8ACB\u8F38\u5165\u7DB2\u57DF\u6216 URL (\u4F8B\u5982 example.com, localhost, 127.0.0.1)"
  },
  options_firewall_btnAdd: {
    message: "\u65B0\u589E"
  },
  options_firewall_btnRemove: {
    message: "\u79FB\u9664"
  },
  options_firewall_howItWorks_header: {
    message: "\u9632\u706B\u7246\u904B\u4F5C\u539F\u7406"
  },
  options_firewall_howItWorks: {
    message: "\u9632\u706B\u7246\u5305\u542B\u4E00\u500B\u62D2\u7D55\u6E05\u55AE\u548C\u4E00\u500B\u5141\u8A31\u6E05\u55AE\u3002\n- \u5982\u679C\u5169\u500B\u6E05\u55AE\u90FD\u70BA\u7A7A\uFF0C\u5247\u5141\u8A31\u6240\u6709 URL\u3002\n- \u62D2\u7D55\u6E05\u55AE\u5177\u6709\u8F03\u9AD8\u512A\u5148\u9806\u5E8F\u3002\u5982\u679C\u4E00\u500B URL \u7B26\u5408\u4EFB\u4F55\u62D2\u7D55\u6E05\u55AE\u4E2D\u7684\u9805\u76EE\uFF0C\u5B83\u5C07\u88AB\u5C01\u9396\u3002\n- \u7576\u5141\u8A31\u6E05\u55AE\u70BA\u7A7A\u6642\uFF0C\u6240\u6709\u672A\u88AB\u62D2\u7D55\u7684 URL \u90FD\u6703\u88AB\u5141\u8A31\u3002\n- \u7576\u5141\u8A31\u6E05\u55AE\u4E0D\u70BA\u7A7A\u6642\uFF0C\u53EA\u6709\u7B26\u5408\u6E05\u55AE\u4E2D\u9805\u76EE\u7684 URL \u624D\u88AB\u5141\u8A31\u3002\n- \u76EE\u524D\u5C1A\u4E0D\u652F\u63F4\u842C\u7528\u5B57\u5143\u3002\n- \u5EFA\u8B70\u512A\u5148\u4F7F\u7528\u5141\u8A31\u6E05\u55AE\uFF0C\u800C\u975E\u62D2\u7D55\u6E05\u55AE\u3002"
  },
  bg_errors_noTabId: {
    message: "\u672A\u63D0\u4F9B\u5206\u9801 ID"
  },
  bg_errors_noTaskId: {
    message: "\u672A\u63D0\u4F9B\u4EFB\u52D9 ID"
  },
  bg_errors_noRunningTask: {
    message: "\u6C92\u6709\u57F7\u884C\u4E2D\u7684\u4EFB\u52D9"
  },
  bg_cmd_newTask_noTask: {
    message: "\u672A\u63D0\u4F9B\u4EFB\u52D9"
  },
  bg_cmd_followUpTask_noTask: {
    message: "\u672A\u63D0\u4F9B\u5F8C\u7E8C\u4EFB\u52D9"
  },
  bg_cmd_followUpTask_cleaned: {
    message: "\u57F7\u884C\u5668\u5DF2\u88AB\u6E05\u7406\uFF0C\u7121\u6CD5\u65B0\u589E\u5F8C\u7E8C\u4EFB\u52D9\u3002"
  },
  bg_cmd_resumeTask_noTask: {
    message: "\u6C92\u6709\u53EF\u63A5\u7E8C\u7684\u4EFB\u52D9\u3002"
  },
  bg_cmd_state_printed: {
    message: "\u72C0\u614B\u5DF2\u8F38\u51FA\u81F3\u63A7\u5236\u53F0\u3002"
  },
  bg_cmd_state_failed: {
    message: "\u7121\u6CD5\u53D6\u5F97\u72C0\u614B"
  },
  bg_cmd_nohighlight_ok: {
    message: "\u9192\u76EE\u6A19\u793A\u5DF2\u79FB\u9664\u3002"
  },
  bg_cmd_stt_noAudioData: {
    message: "\u672A\u63D0\u4F9B\u97F3\u8A0A\u8CC7\u6599"
  },
  bg_cmd_stt_failed: {
    message: "\u8A9E\u97F3\u8FA8\u8B58\u5931\u6557"
  },
  bg_cmd_replay_noHistory: {
    message: "\u672A\u63D0\u4F9B\u6B77\u53F2\u5DE5\u4F5C\u968E\u6BB5 ID\u3002"
  },
  bg_cmd_replay_failed: {
    message: "\u91CD\u64AD\u5931\u6557"
  },
  bg_setup_noApiKeys: {
    message: "\u8ACB\u5148\u5728\u8A2D\u5B9A\u9801\u9762\u4E2D\u5B8C\u6210 API \u91D1\u9470\u7684\u8A2D\u5B9A\u3002"
  },
  bg_setup_noProvider: {
    message: "\u5728\u8A2D\u5B9A\u4E2D\u627E\u4E0D\u5230\u63D0\u4F9B\u8005 $PROVIDER$\u3002",
    placeholders: {
      provider: {
        content: "$1",
        example: "openai"
      }
    }
  },
  bg_setup_noNavigatorModel: {
    message: "\u8ACB\u5148\u5728\u8A2D\u5B9A\u4E2D\u70BA\u5C0E\u89BD\u4EE3\u7406\u7A0B\u5F0F\u9078\u64C7\u4E00\u500B\u6A21\u578B\u3002"
  },
  exec_errors_maxStepsReached: {
    message: "\u5DF2\u9054\u6B65\u9A5F\u4E0A\u9650"
  },
  exec_errors_maxFailuresReached: {
    message: "\u5DF2\u9054\u5931\u6557\u6B21\u6578\u4E0A\u9650\u3002"
  },
  exec_task_cancel: {
    message: "\u4EFB\u52D9\u5DF2\u53D6\u6D88"
  },
  exec_task_pause: {
    message: "\u4EFB\u52D9\u5DF2\u66AB\u505C"
  },
  exec_task_fail: {
    message: "\u4EFB\u52D9\u5931\u6557\uFF1A\n\n$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Connection timeout"
      }
    }
  },
  exec_replay_cancel: {
    message: "\u91CD\u64AD\u5DF2\u53D6\u6D88"
  },
  exec_replay_ok: {
    message: "\u91CD\u64AD\u5DF2\u5B8C\u6210"
  },
  exec_replay_fail: {
    message: "\u91CD\u64AD\u5931\u6557\uFF1A\n\n$ERROR_MESSAGE$",
    placeholders: {
      error_message: {
        content: "$1",
        example: "Network error"
      }
    }
  },
  exec_replay_historyNotFound: {
    message: "\u627E\u4E0D\u5230\u6B77\u53F2\u7D00\u9304"
  },
  exec_replay_historyEmpty: {
    message: "\u6B77\u53F2\u7D00\u9304\u70BA\u7A7A"
  },
  act_searchGoogle_start: {
    message: '\u6B63\u5728 Google \u4E0A\u641C\u5C0B "$QUERY$"',
    placeholders: {
      query: {
        content: "$1",
        example: "weather today"
      }
    }
  },
  act_searchGoogle_ok: {
    message: '\u5DF2\u5728 Google \u4E0A\u641C\u5C0B "$QUERY$"',
    placeholders: {
      query: {
        content: "$1",
        example: "weather today"
      }
    }
  },
  act_goToUrl_start: {
    message: "\u6B63\u5728\u524D\u5F80 $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_goToUrl_ok: {
    message: "\u5DF2\u524D\u5F80 $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_goBack_start: {
    message: "\u6B63\u5728\u56DE\u5230\u4E0A\u4E00\u9801"
  },
  act_goBack_ok: {
    message: "\u5DF2\u56DE\u5230\u4E0A\u4E00\u9801"
  },
  act_wait_start: {
    message: "\u7B49\u5F85 $SECONDS$ \u79D2",
    placeholders: {
      seconds: {
        content: "$1",
        example: "3"
      }
    }
  },
  act_wait_ok: {
    message: "\u5DF2\u7B49\u5019 $SECONDS$ \u79D2",
    placeholders: {
      seconds: {
        content: "$1",
        example: "3"
      }
    }
  },
  act_click_start: {
    message: "\u6B63\u5728\u9EDE\u9078\u7D22\u5F15\u70BA $INDEX$ \u7684\u5143\u7D20",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_elementNotExist: {
    message: "\u7D22\u5F15\u70BA $INDEX$ \u7684\u5143\u7D20\u4E0D\u5B58\u5728\uFF0C\u8ACB\u91CD\u8A66\u6216\u6539\u7528\u5176\u4ED6\u64CD\u4F5C",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_elementNoLongerAvailable: {
    message: "\u7D22\u5F15\u70BA $INDEX$ \u7684\u5143\u7D20\u5DF2\u7121\u6CD5\u4F7F\u7528\uFF0C\u9801\u9762\u53EF\u80FD\u5DF2\u8B8A\u66F4",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_click_fileUploader: {
    message: "\u7D22\u5F15 $INDEX$ \u7684\u5143\u7D20\u6703\u958B\u555F\u6A94\u6848\u4E0A\u50B3\u5C0D\u8A71\u65B9\u584A\u3002\u5982\u9700\u4E0A\u50B3\u6A94\u6848\uFF0C\u8ACB\u4F7F\u7528\u6307\u5B9A\u7684\u6A94\u6848\u4E0A\u50B3\u529F\u80FD\u3002",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_click_ok: {
    message: "\u5DF2\u9EDE\u9078\u7D22\u5F15\u70BA $INDEX$ \u7684\u6309\u9215\uFF1A$TEXT$",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      },
      text: {
        content: "$2",
        example: "Submit Button"
      }
    }
  },
  act_click_newTabOpened: {
    message: "\u5DF2\u958B\u555F\u65B0\u5206\u9801\uFF0C\u6B63\u5728\u5207\u63DB\u81F3\u8A72\u5206\u9801"
  },
  act_inputText_start: {
    message: "\u6B63\u5728\u65BC\u7D22\u5F15\u70BA $INDEX$ \u7684\u6B04\u4F4D\u4E2D\u8F38\u5165\u6587\u5B57",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_inputText_ok: {
    message: '\u5DF2\u5C07 "$TEXT$" \u8F38\u5165\u81F3\u7D22\u5F15\u70BA $INDEX$ \u7684\u6B04\u4F4D',
    placeholders: {
      text: {
        content: "$1",
        example: "Hello World"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_switchTab_start: {
    message: "\u6B63\u5728\u5207\u63DB\u81F3\u5206\u9801 $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_switchTab_ok: {
    message: "\u5DF2\u5207\u63DB\u81F3\u5206\u9801 $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_openTab_start: {
    message: "\u5728\u65B0\u5206\u9801\u958B\u555F $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_openTab_ok: {
    message: "\u5DF2\u5728\u65B0\u5206\u9801\u958B\u555F $URL$",
    placeholders: {
      url: {
        content: "$1",
        example: "https://example.com"
      }
    }
  },
  act_closeTab_start: {
    message: "\u6B63\u5728\u95DC\u9589\u5206\u9801 $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_closeTab_ok: {
    message: "\u5DF2\u95DC\u9589\u5206\u9801 $TAB_ID$",
    placeholders: {
      tab_id: {
        content: "$1",
        example: "123456"
      }
    }
  },
  act_cache_start: {
    message: "\u6B63\u5728\u5FEB\u53D6\u7D50\u679C\uFF1A$CONTENT$",
    placeholders: {
      content: {
        content: "$1",
        example: "User preferences saved"
      }
    }
  },
  act_cache_ok: {
    message: "\u5DF2\u5FEB\u53D6\u7D50\u679C\uFF1A$CONTENT$",
    placeholders: {
      content: {
        content: "$1",
        example: "User preferences saved"
      }
    }
  },
  act_scrollToPercent_start: {
    message: "\u6B63\u5728\u6372\u52D5\u81F3 $PERCENT$ \u767E\u5206\u6BD4\u4F4D\u7F6E",
    placeholders: {
      percent: {
        content: "$1",
        example: "50"
      }
    }
  },
  act_scrollToPercent_ok: {
    message: "\u5DF2\u6372\u52D5\u81F3 $PERCENT$ \u767E\u5206\u6BD4\u4F4D\u7F6E",
    placeholders: {
      percent: {
        content: "$1",
        example: "50"
      }
    }
  },
  act_scrollToTop_start: {
    message: "\u6372\u52D5\u81F3\u9802\u7AEF"
  },
  act_scrollToTop_ok: {
    message: "\u5DF2\u6372\u52D5\u81F3\u9802\u7AEF"
  },
  act_scrollToBottom_start: {
    message: "\u6372\u52D5\u81F3\u5E95\u90E8"
  },
  act_scrollToBottom_ok: {
    message: "\u5DF2\u6372\u52D5\u81F3\u5E95\u90E8"
  },
  act_previousPage_start: {
    message: "\u6372\u52D5\u81F3\u4E0A\u4E00\u9801"
  },
  act_previousPage_ok: {
    message: "\u5DF2\u6372\u52D5\u81F3\u4E0A\u4E00\u9801"
  },
  act_nextPage_start: {
    message: "\u6372\u52D5\u81F3\u4E0B\u4E00\u9801"
  },
  act_nextPage_ok: {
    message: "\u5DF2\u6372\u52D5\u81F3\u4E0B\u4E00\u9801"
  },
  act_errors_alreadyAtTop: {
    message: "\u7D22\u5F15\u70BA $INDEX$ \u7684\u5143\u7D20\u5DF2\u5728\u9802\u7AEF\uFF0C\u7121\u6CD5\u6372\u52D5\u81F3\u4E0A\u4E00\u9801",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_pageAlreadyAtTop: {
    message: "\u9801\u9762\u5DF2\u5728\u9802\u7AEF\uFF0C\u7121\u6CD5\u6372\u52D5\u81F3\u4E0A\u4E00\u9801"
  },
  act_errors_alreadyAtBottom: {
    message: "\u7D22\u5F15\u70BA $INDEX$ \u7684\u5143\u7D20\u5DF2\u5728\u5E95\u90E8\uFF0C\u7121\u6CD5\u6372\u52D5\u81F3\u4E0B\u4E00\u9801",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_errors_pageAlreadyAtBottom: {
    message: "\u9801\u9762\u5DF2\u5728\u5E95\u90E8\uFF0C\u7121\u6CD5\u6372\u52D5\u81F3\u4E0B\u4E00\u9801"
  },
  act_scrollToText_start: {
    message: '\u6B63\u5728\u6372\u52D5\u81F3\u6587\u5B57\uFF1A "$TEXT$" \uFF0C\u7B2C $OCCURRENCE$ \u6B21\u51FA\u73FE\u7684\u4F4D\u7F6E',
    placeholders: {
      text: {
        content: "$1",
        example: "Contact Us"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_ok: {
    message: '\u5DF2\u6372\u52D5\u81F3\u6587\u5B57\uFF1A "$TEXT$" \uFF0C\u7B2C $OCCURRENCE$ \u6B21\u51FA\u73FE\u7684\u4F4D\u7F6E',
    placeholders: {
      text: {
        content: "$1",
        example: "Contact Us"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_notFound: {
    message: '\u627E\u4E0D\u5230\u6216\u770B\u4E0D\u898B\u6587\u5B57 "$TEXT$" (\u7B2C $OCCURRENCE$ \u6B21\u51FA\u73FE)',
    placeholders: {
      text: {
        content: "$1",
        example: "Contact Us"
      },
      occurrence: {
        content: "$2",
        example: "2"
      }
    }
  },
  act_scrollToText_failed: {
    message: "\u6372\u52D5\u81F3\u6587\u5B57\u5931\u6557\uFF1A$ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Element not found"
      }
    }
  },
  act_sendKeys_start: {
    message: "\u50B3\u9001\u6309\u9375\uFF1A$KEYS$",
    placeholders: {
      keys: {
        content: "$1",
        example: "Enter"
      }
    }
  },
  act_sendKeys_ok: {
    message: "\u5DF2\u50B3\u9001\u6309\u9375\uFF1A$KEYS$",
    placeholders: {
      keys: {
        content: "$1",
        example: "Enter"
      }
    }
  },
  act_getDropdownOptions_start: {
    message: "\u6B63\u5728\u5F9E\u7D22\u5F15\u70BA $INDEX$ \u7684\u4E0B\u62C9\u5F0F\u9078\u55AE\u4E2D\u53D6\u5F97\u9078\u9805",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_getDropdownOptions_useExactText: {
    message: "\u8ACB\u5728 select_dropdown_option \u4E2D\u4F7F\u7528\u5B8C\u5168\u76F8\u7B26\u7684\u6587\u5B57\u5B57\u4E32"
  },
  act_getDropdownOptions_ok: {
    message: "\u5DF2\u5F9E\u4E0B\u62C9\u5F0F\u9078\u55AE\u53D6\u5F97 $COUNT$ \u500B\u9078\u9805",
    placeholders: {
      count: {
        content: "$1",
        example: "5"
      }
    }
  },
  act_getDropdownOptions_noOptions: {
    message: "\u5728\u4E0B\u62C9\u5F0F\u9078\u55AE\u4E2D\u627E\u4E0D\u5230\u4EFB\u4F55\u9078\u9805"
  },
  act_getDropdownOptions_failed: {
    message: "\u7121\u6CD5\u53D6\u5F97\u4E0B\u62C9\u5F0F\u9078\u55AE\u9078\u9805\uFF1A$ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Element not found"
      }
    }
  },
  act_selectDropdownOption_start: {
    message: '\u6B63\u5728\u5F9E\u7D22\u5F15\u70BA $INDEX$ \u7684\u4E0B\u62C9\u5F0F\u9078\u55AE\u4E2D\u9078\u53D6 "$TEXT$" \u9078\u9805',
    placeholders: {
      text: {
        content: "$1",
        example: "Option 1"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_selectDropdownOption_ok: {
    message: '\u5DF2\u5F9E\u7D22\u5F15\u70BA $INDEX$ \u7684\u4E0B\u62C9\u5F0F\u9078\u55AE\u4E2D\u9078\u53D6 "$TEXT$" \u9078\u9805',
    placeholders: {
      text: {
        content: "$1",
        example: "Option 1"
      },
      index: {
        content: "$2",
        example: "5"
      }
    }
  },
  act_selectDropdownOption_notSelect: {
    message: "\u7121\u6CD5\u9078\u53D6\u9078\u9805\uFF1A\u7D22\u5F15\u70BA $INDEX$ \u7684\u5143\u7D20\u662F $TAG_NAME$ \u800C\u975E SELECT \u5143\u7D20",
    placeholders: {
      index: {
        content: "$1",
        example: "5"
      },
      tag_name: {
        content: "$2",
        example: "DIV"
      }
    }
  },
  act_selectDropdownOption_failed: {
    message: "\u7121\u6CD5\u9078\u53D6\u9078\u9805\uFF1A$ERROR$",
    placeholders: {
      error: {
        content: "$1",
        example: "Option not found"
      }
    }
  }
};

// lib/getMessageFromLocale.ts
function getMessageFromLocale(locale) {
  switch (locale) {
    case "en":
      return messages_default;
    case "pt_BR":
      return messages_default2;
    case "zh_TW":
      return messages_default3;
    default:
      throw new Error("Unsupported locale");
  }
}
var defaultLocale = (() => {
  const locales = ["en", "pt_BR", "zh_TW"];
  const firstLocale = locales[0];
  const defaultLocale2 = Intl.DateTimeFormat().resolvedOptions().locale.replace("-", "_");
  if (locales.includes(defaultLocale2)) {
    return defaultLocale2;
  }
  const defaultLocaleWithoutRegion = defaultLocale2.split("_")[0];
  if (locales.includes(defaultLocaleWithoutRegion)) {
    return defaultLocaleWithoutRegion;
  }
  return firstLocale;
})();

// lib/i18n.ts
function translate(key, substitutions) {
  const value = getMessageFromLocale(t.devLocale)[key];
  let message = value.message;
  if (value.placeholders) {
    Object.entries(value.placeholders).forEach(([key2, { content }]) => {
      if (!content) {
        return;
      }
      message = message.replace(new RegExp(`\\$${key2}\\$`, "gi"), content);
    });
  }
  if (!substitutions) {
    return message;
  }
  if (Array.isArray(substitutions)) {
    return substitutions.reduce((acc, cur, idx) => acc.replace(`$${idx + 1}`, cur), message);
  }
  return message.replace(/\$(\d+)/, substitutions);
}
function removePlaceholder(message) {
  return message.replace(/\$\d+/g, "");
}
var t = (...args) => {
  return removePlaceholder(translate(...args));
};
t.devLocale = defaultLocale;

// index.ts
var t2 = t;
export {
  t2 as t
};
//# sourceMappingURL=index.js.map

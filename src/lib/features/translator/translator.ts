export const translations = {
    en: {
        // global
        global: {
            confirm: 'Confirm',
            cancel: 'Cancel',
            save: 'Save',
            noAnomalyDetected: 'No anomalies detected',
            preparingBoard: 'Preparing project board...'
        },
        // main content
        main: {
            welcome: 'Welcome to Kanbanomaly',
            description: 'Got a project anomaly? Kanbanomaly will catch it before your coffee gets cold',
            initialize: 'Ready to initialize'
        },
        // user interface
        ui: {
            settings: 'Settings',
            language: 'Language'
        },
        // sidebar
        sidebar: {
            createProject: 'Create New Project',
            projectsList: 'Projects',
            noProjects: 'No projects detected',
            openSettings: 'Open settings',
            collapse: 'Collapse sidebar',
            expand: 'Expand sidebar'
        },
        // projects modal
        projects: {
            create: 'Create Project',
            new_create: 'Create New Project',
            edit: 'Edit Project',
            delete: 'Delete project',
            save_changes: 'Save Changes',
            title: 'Project Title',
            status: 'Project Status',
            enter_project_name: 'Enter project name',
            noProjects: 'No projects detected',
            
            statusLabels: {
                active: 'Active',
                inactive: 'Inactive',
                ended: 'Ended'
            },
            headers: {
                active: 'PROJECT ACTIVE',
                inactive: 'PROJECT INACTIVE',
                ended: 'PROJECT ENDED',
                start_date: 'Start date:',
                end_date: 'End date:',
                notConfigured: 'Not configured'
            }
        },
        // tasks
        tasks: {
            deploy: 'Deploy Task',
            deployNew: 'Deploy New Task',
            enterName: 'Enter task name',
            loading: 'Loading Tasks...',
            
            columns: {
                todo: 'TODO',
                doing: 'IN PROGRESS',
                done: 'COMPLETED'
            },

            priority: {
                low: 'Low Priority',
                medium: 'Medium Priority',
                high: 'High Priority',
                critical: 'Critical Priority'
            },

            levels: {
                low: 'LOW',
                medium: 'MEDIUM',
                high: 'HIGH',
                critical: 'CRITICAL'
            }
        },
        // deadline
        deadline: {
            tracker: 'DEADLINE TRACKER',
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes'
        },
        // toasts
        toasts: {
            success: {
                projectCreated: 'Project created successfully',
                projectUpdated: 'Project updated successfully',
                projectDeleted: 'Project deleted successfully',
                taskCreated: 'Task created successfully',
                taskUpdated: 'Task updated successfully',
                taskDeleted: 'Task deleted successfully',
                taskMoved: 'Task moved successfully',
                settingsSuccess: 'Settings saved'
            },

            error: {
                projectCreateFailed: 'Failed to create project',
                projectUpdateFailed: 'Failed to update project',
                projectDeleteFailed: 'Failed to delete project',
                projectLoadDetailsFailed: 'Failed to load project details',
                projectsLoadFailed: 'Failed to load projects',
                projectsPrepareFailed: 'Failed to prepare projects',
                taskCreateFailed: 'Failed to create task',
                taskUpdateFailed: 'Failed to update task',
                taskDeleteFailed: 'Failed to delete task',
                taskLoadFailed: 'Failed to load tasks for project',
                taskMoveFailed: 'Failed to move task'
            },

            confirm: {
                deleteProject: 'Are you sure you want to delete this project?',
                deleteTask: 'Are you sure you want to delete this task?'
            },

            validation: {
                enterProjectName: 'Please enter a project name and choose a status',
                enterTaskName: 'Please enter a task name'
            },
            other: {
                projectPrefix: 'Project',
                projectSuffixUpdate: 'updated successfully',
                projectSuffixSuccess: 'created successfully',
                taskPrefix: 'Task',
                taskSuffixSuccess: 'added successfully'
            }
        },
        // error
        error: {
            unknown: 'An unknown error occurred',
            unexpected: 'An unexpected error occurred.',
            details: 'Error Details:',
            titlePrefix: 'Error',
            tips: {
                suggestions: 'What you can try:',
                checkDatabase: 'Check if the database server is running and accessible',
                checkAPI: 'Ensure that the API endpoint is correct',
                refresh: 'Try refreshing the page',
            },
        }
    },
    
    pl: {
        // global
        global: {
            confirm: 'Potwierdź',
            cancel: 'Anuluj',
            save: 'Zapisz',
            noAnomalyDetected: 'Nie wykryto anomalii',
            preparingBoard: 'Przygotowywanie tablicy projektu...'
        },
        // main content
        main: {
            welcome: 'Witamy w Kanbanomaly',
            description: 'Masz anomalię projektu? Kanbanomaly wychwyci to, zanim kawa zdąży ostygnąć',
            initialize: 'Gotowy do zainicjowania'
        },
        // user interface
        ui: {
            settings: 'Ustawienia',
            language: 'Język'
        },
        // sidebar
        sidebar: {
            createProject: 'Utwórz nowy projekt',
            projectsList: 'Projekty',
            noProjects: 'Nie wykryto projektów',
            openSettings: 'Otwórz ustawienia',
            collapse: 'Zwiń pasek boczny',
            expand: 'Rozwiń pasek boczny'
        },
        // projects modal
        projects: {
            create: 'Utwórz projekt',
            new_create: 'Utwórz nowy projekt',
            edit: 'Edytuj projekt',
            delete: 'Usuń projekt',
            save_changes: 'Zapisz zmiany',
            title: 'Tytuł projektu',
            status: 'Status projektu',
            enter_project_name: 'Wprowadź nazwę projektu',
            noProjects: 'Nie wykryto projektów',
            
            statusLabels: {
                active: 'Aktywny',
                inactive: 'Nieaktywny',
                ended: 'Zakończony'
            },
            headers: {
                active: 'PROJEKT AKTYWNY',
                inactive: 'PROJEKT NIEAKTYWNY',
                ended: 'PROJEKT ZAKOŃCZONY',
                start_date: 'Data rozpoczęcia:',
                end_date: 'Data zakończenia:',
                notConfigured: 'Nie skonfigurowano'
            }
        },
        // tasks
        tasks: {
            deploy: 'Wdróż zadanie',
            deployNew: 'Wdróż nowe zadanie',
            enterName: 'Wprowadź nazwę zadania',
            loading: 'Ładowanie zadań...',
            
            columns: {
                todo: 'DO ZROBIENIA',
                doing: 'W TRAKCIE',
                done: 'ZREALIZOWANE'
            },

            priority: {
                low: 'Niski priorytet',
                medium: 'Średni priorytet',
                high: 'Wysoki priorytet',
                critical: 'Krytyczny priorytet'
            },

            levels: {
                low: 'NISKI',
                medium: 'ŚREDNI',
                high: 'WYSOKI',
                critical: 'KRYTYCZNY'
            }
        },
        // deadline
        deadline: {
            tracker: 'ŚLEDZENIE TERMINU',
            days: 'Dni',
            hours: 'Godziny',
            minutes: 'Minuty'
        },
        // toasts
        toasts: {
            success: {
                projectCreated: 'Projekt został utworzony pomyślnie',
                projectUpdated: 'Projekt został zaktualizowany pomyślnie',
                projectDeleted: 'Projekt został usunięty pomyślnie',
                taskCreated: 'Zadanie zostało utworzone pomyślnie',
                taskUpdated: 'Zadanie zostało zaktualizowane pomyślnie',
                taskDeleted: 'Zadanie zostało usunięte pomyślnie',
                taskMoved: 'Zadanie zostało przeniesione pomyślnie',
                settingsSuccess: 'Zapisano ustawienia'
            },

            error: {
                projectCreateFailed: 'Nie udało się utworzyć projektu',
                projectUpdateFailed: 'Nie udało się zaktualizować projektu',
                projectDeleteFailed: 'Nie udało się usunąć projektu',
                projectLoadDetailsFailed: 'Nie udało się załadować szczegółów projektu',
                projectsLoadFailed: 'Nie udało się załadować projektów',
                projectsPrepareFailed: 'Nie udało się przygotować projektów',
                taskCreateFailed: 'Nie udało się utworzyć zadania',
                taskUpdateFailed: 'Nie udało się zaktualizować zadania',
                taskDeleteFailed: 'Nie udało się usunąć zadania',
                taskLoadFailed: 'Nie udało się załadować zadań dla projektu',
                taskMoveFailed: 'Nie udało się przenieść zadania'
            },

            confirm: {
                deleteProject: 'Czy na pewno chcesz usunąć ten projekt?',
                deleteTask: 'Czy na pewno chcesz usunąć to zadanie?'
            },

            validation: {
                enterProjectName: 'Wprowadź nazwę projektu i wybierz status',
                enterTaskName: 'Wprowadź nazwę zadania'
            },
            other: {
                projectPrefix: 'Projekt',
                projectSuffixUpdate: 'zaktualizowano pomyślnie',
                projectSuffixSuccess: 'utworzono pomyślnie',
                taskPrefix: 'Zadanie',
                taskSuffixSuccess: 'dodano pomyślnie'
            }
        },
        // error
        error: {
            unknown: 'Wystąpił nieznany błąd',
            unexpected: 'Wystąpił nieoczekiwany błąd.',
            details: 'Szczegóły błędu:',
            titlePrefix: 'Błąd',
            tips: {
                suggestions: 'Co możesz spróbować:',
                checkDatabase: 'Sprawdź, czy serwer bazy danych działa i jest dostępny',
                checkAPI: 'Upewnij się, że punkt końcowy API jest prawidłowy',
                refresh: 'Spróbuj odświeżyć stronę',
            },
        }
    },

    de: {
        // global
        global: {
            confirm: 'Bestätigen',
            cancel: 'Abbrechen',
            save: 'Speichern',
            noAnomalyDetected: 'Keine Anomalien erkannt',
            preparingBoard: 'Vorbereiten des Projektboards...'
        },
        // main content
        main: {
            welcome: 'Willkommen bei Kanbanomaly',
            description: 'Haben Sie eine Projektanomalie? Kanbanomaly wird es erkennen, bevor Ihr Kaffee kalt wird',
            initialize: 'Bereit zur Initialisierung'
        },
        // user interface
        ui: {
            settings: 'Einstellungen',
            language: 'Sprache'
        },
        // sidebar
        sidebar: {
            createProject: 'Neues Projekt erstellen',
            projectsList: 'Projekte',
            noProjects: 'Keine Projekte erkannt',
            openSettings: 'Einstellungen öffnen',
            collapse: 'Seitenleiste zuklappen',
            expand: 'Seitenleiste aufklappen'
        },
        // projects modal
        projects: {
            create: 'Projekt erstellen',
            new_create: 'Neues Projekt erstellen',
            edit: 'Projekt bearbeiten',
            delete: 'Projekt löschen',
            save_changes: 'Änderungen speichern',
            title: 'Projektname',
            status: 'Projektstatus',
            enter_project_name: 'Projektname eingeben',
            noProjects: 'Keine Projekte erkannt',
            
            statusLabels: {
                active: 'Aktiv',
                inactive: 'Inaktiv',
                ended: 'Beendet'
            },
            headers: {
                active: 'PROJEKT AKTIV',
                inactive: 'PROJEKT INAKTIV',
                ended: 'PROJEKT BEENDET',
                start_date: 'Startdatum:',
                end_date: 'Enddatum:',
                notConfigured: 'Nicht konfiguriert'
            }
        },
        // tasks
        tasks: {
            deploy: 'Aufgabe bereitstellen',
            deployNew: 'Neue Aufgabe bereitstellen',
            enterName: 'Aufgabenname eingeben',
            loading: 'Lade Aufgaben...',
            
            columns: {
                todo: 'ZU ERLEDIGEN',
                doing: 'IN BEARBEITUNG',
                done: 'FERTIGGESTELLT'
            },

            priority: {
                low: 'Niedrige Priorität',
                medium: 'Mittlere Priorität',
                high: 'Hohe Priorität',
                critical: 'Kritische Priorität'
            },

            levels: {
                low: 'NIEDRIG',
                medium: 'MITTEL',
                high: 'HOCH',
                critical: 'KRITISCH'
            }
        },
        // deadline
        deadline: {
            tracker: 'FRISTENVERFOLGUNG',
            days: 'Tage',
            hours: 'Stunden',
            minutes: 'Minuten'
        },
        // toasts
        toasts: {
            success: {
                projectCreated: 'Projekt erfolgreich erstellt',
                projectUpdated: 'Projekt erfolgreich aktualisiert',
                projectDeleted: 'Projekt erfolgreich gelöscht',
                taskCreated: 'Aufgabe erfolgreich erstellt',
                taskUpdated: 'Aufgabe erfolgreich aktualisiert',
                taskDeleted: 'Aufgabe erfolgreich gelöscht',
                taskMoved: 'Aufgabe erfolgreich verschoben',
                settingsSuccess: 'Einstellungen erfolgreich gespeichert'
            },

            error: {
                projectCreateFailed: 'Erstellen des Projekts fehlgeschlagen',
                projectUpdateFailed: 'Aktualisierung des Projekts fehlgeschlagen',
                projectDeleteFailed: 'Löschen des Projekts fehlgeschlagen',
                projectLoadDetailsFailed: 'Laden der Projektdetails fehlgeschlagen',
                projectsLoadFailed: 'Laden der Projekte fehlgeschlagen',
                projectsPrepareFailed: 'Vorbereiten der Projekte fehlgeschlagen',
                taskCreateFailed: 'Erstellen der Aufgabe fehlgeschlagen',
                taskUpdateFailed: 'Aktualisierung der Aufgabe fehlgeschlagen',
                taskDeleteFailed: 'Löschen der Aufgabe fehlgeschlagen',
                taskLoadFailed: 'Laden der Aufgaben für Projekt fehlgeschlagen',
                taskMoveFailed: 'Verschieben der Aufgabe fehlgeschlagen'
            },

            confirm: {
                deleteProject: 'Sind Sie sicher, dass Sie dieses Projekt löschen möchten?',
                deleteTask: 'Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?'
            },

            validation: {
                enterProjectName: 'Bitte geben Sie einen Projektnamen ein und wählen Sie einen Status',
                enterTaskName: 'Bitte geben Sie einen Aufgabennamen ein'
            },
            other: {
                projectPrefix: 'Projekt',
                projectSuffixUpdate: 'erfolgreich aktualisiert',
                projectSuffixSuccess: 'erfolgreich erstellt',
                taskPrefix: 'Aufgabe',
                taskSuffixSuccess: 'erfolgreich hinzugefügt'
            }
        },
        // error
        error: {
            unknown: 'Ein unbekannter Fehler ist aufgetreten',
            unexpected: 'Ein unerwarteter Fehler ist aufgetreten.',
            details: 'Fehlerdetails:',
            titlePrefix: 'Fehler',
            tips: {
                suggestions: 'Was Sie versuchen können:',
                checkDatabase: 'Überprüfen Sie, ob der Datenbankserver läuft und zugänglich ist',
                checkAPI: 'Stellen Sie sicher, dass der API-Endpunkt korrekt ist',
                refresh: 'Versuchen Sie, die Seite zu aktualisieren',
            },
        }
    }
}
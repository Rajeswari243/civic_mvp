/* =========================================================
   CIVIC CONNECT
   Smart Civic Issue Management System
   ========================================================= */


/* =========================================================
   DEMO USERS
   ========================================================= */

const users = {

    citizen: {
        username: "citizen",
        password: "1234",
        role: "citizen",
        name: "Demo Citizen"
    },

    authority: {
        username: "admin",
        password: "admin123",
        role: "authority",
        name: "Municipal Authority"
    }

};


/* =========================================================
   OFFICERS
   Different officers are responsible for different areas
   ========================================================= */

const officers = [

    {
        id: "OFF001",
        name: "Ravi Kumar",
        area: "Ward 1",
        department: "Roads"
    },

    {
        id: "OFF002",
        name: "Priya Sharma",
        area: "Ward 1",
        department: "Water"
    },

    {
        id: "OFF003",
        name: "Arjun Reddy",
        area: "Ward 2",
        department: "Street Lights"
    },

    {
        id: "OFF004",
        name: "Sneha Rao",
        area: "Ward 2",
        department: "Garbage"
    },

    {
        id: "OFF005",
        name: "Kiran Kumar",
        area: "Ward 3",
        department: "Drainage"
    },

    {
        id: "OFF006",
        name: "Lakshmi Devi",
        area: "Ward 3",
        department: "Water"
    },

    {
        id: "OFF007",
        name: "Vamsi Krishna",
        area: "Ward 4",
        department: "Roads"
    },

    {
        id: "OFF008",
        name: "Anjali Reddy",
        area: "Ward 4",
        department: "Electricity"
    },

    {
        id: "OFF009",
        name: "Mahesh Babu",
        area: "Ward 5",
        department: "Garbage"
    },

    {
        id: "OFF010",
        name: "Divya Rao",
        area: "Ward 5",
        department: "Drainage"
    }

];


/* =========================================================
   STORAGE
   ========================================================= */

function getIssues() {

    return JSON.parse(
        localStorage.getItem("civicIssues") || "[]"
    );

}


function saveIssues(issues) {

    localStorage.setItem(
        "civicIssues",
        JSON.stringify(issues)
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    document
        .getElementById("issueForm")
        .addEventListener("submit", createIssue);

    const session =
        JSON.parse(
            localStorage.getItem("civicSession")
        );

    if (session) {

        if (session.role === "citizen") {

            showDashboard("citizen");

        } else if (session.role === "authority") {

            showDashboard("authority");

        }

    }

});


/* =========================================================
   LOGIN
   ========================================================= */

let selectedRole = "";


function showLogin(role) {

    selectedRole = role;

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

    const title =
        document.getElementById("loginTitle");

    if (role === "citizen") {

        title.innerText = "Citizen Login";

    } else {

        title.innerText = "Authority Login";

    }

}


function login() {

    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;

    const user = users[selectedRole];

    if (
        user &&
        username === user.username &&
        password === user.password
    ) {

        localStorage.setItem(
            "civicSession",
            JSON.stringify(user)
        );

        document
            .getElementById("loginMessage")
            .innerText = "";

        showDashboard(user.role);

    } else {

        document
            .getElementById("loginMessage")
            .innerText =
                "Invalid username or password.";

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    localStorage.removeItem("civicSession");

    location.reload();

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function showDashboard(role) {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("citizenDashboard")
        .classList.add("hidden");

    document
        .getElementById("authorityDashboard")
        .classList.add("hidden");


    if (role === "citizen") {

        document
            .getElementById("citizenDashboard")
            .classList.remove("hidden");

        renderCitizenIssues();

    }


    if (role === "authority") {

        document
            .getElementById("authorityDashboard")
            .classList.remove("hidden");

        renderAuthorityIssues();

    }

}


/* =========================================================
   CREATE CIVIC ISSUE
   ========================================================= */

function createIssue(event) {

    event.preventDefault();


    const session =
        JSON.parse(
            localStorage.getItem("civicSession")
        );


    if (
        !session ||
        session.role !== "citizen"
    ) {

        alert(
            "Only citizens can submit complaints."
        );

        return;

    }


    const issues = getIssues();


    const issue = {

        id:
            "ISS-" +
            Date.now(),

        title:
            document
                .getElementById("issueTitle")
                .value,

        category:
            document
                .getElementById("issueCategory")
                .value,

        area:
            document
                .getElementById("issueArea")
                .value,

        location:
            document
                .getElementById("issueLocation")
                .value,

        description:
            document
                .getElementById("issueDescription")
                .value,

        priority:
            document
                .getElementById("issuePriority")
                .value,

        citizen:
            session.name,

        citizenUsername:
            session.username,

        status:
            "Reported",

        verified:
            false,

        assignedOfficer:
            null,

        createdAt:
            new Date().toLocaleString(),

        updatedAt:
            new Date().toLocaleString(),

        timeline: [

            {

                status: "Reported",

                message:
                    "Issue submitted by citizen.",

                actor:
                    "Citizen",

                time:
                    new Date().toLocaleString()

            }

        ]

    };


    issues.push(issue);

    saveIssues(issues);


    document
        .getElementById("issueForm")
        .reset();


    alert(
        "Issue submitted successfully.\nIssue ID: " +
        issue.id
    );


    renderCitizenIssues();

}


/* =========================================================
   CITIZEN ISSUES
   ========================================================= */

function renderCitizenIssues() {

    const session =
        JSON.parse(
            localStorage.getItem("civicSession")
        );


    if (
        !session ||
        session.role !== "citizen"
    ) return;


    const issues =
        getIssues().filter(
            issue =>
                issue.citizenUsername ===
                session.username
        );


    const container =
        document.getElementById(
            "citizenIssues"
        );


    container.innerHTML = "";


    if (issues.length === 0) {

        container.innerHTML =
            "<p>No issues reported yet.</p>";

    }


    issues
        .slice()
        .reverse()
        .forEach(issue => {

            container.innerHTML +=
                createCitizenIssueCard(issue);

        });


    updateCitizenStats(issues);

}


/* =========================================================
   CITIZEN ISSUE CARD
   ========================================================= */

function createCitizenIssueCard(issue) {

    const statusClass =
        getStatusClass(issue.status);


    let officerText =
        "Not assigned yet";


    if (issue.assignedOfficer) {

        officerText =
            issue.assignedOfficer.name +
            " (" +
            issue.assignedOfficer.department +
            ")";

    }


    let reopenButton = "";


    if (issue.status === "Resolved") {

        reopenButton = `

            <button
                class="action-btn warning"
                onclick="requestReopen('${issue.id}')"
            >
                Request Reopen
            </button>

        `;

    }


    return `

        <div class="issue-card">

            <div class="issue-top">

                <div>

                    <div class="issue-title">

                        ${escapeHTML(issue.title)}

                    </div>

                    <div class="issue-meta">

                        ID: ${issue.id}<br>

                        Category: ${issue.category}<br>

                        Area: ${issue.area}<br>

                        Location: ${escapeHTML(issue.location)}<br>

                        Officer:
                        ${escapeHTML(officerText)}

                    </div>

                </div>

                <div>

                    <span class="badge ${statusClass}">

                        ${issue.status}

                    </span>

                    <span class="priority priority-${issue.priority}">

                        ${issue.priority}

                    </span>

                </div>

            </div>


            <div class="issue-description">

                ${escapeHTML(issue.description)}

            </div>


            <div class="action-buttons">

                <button
                    class="action-btn primary"
                    onclick="viewIssue('${issue.id}')"
                >
                    View Details
                </button>

                ${reopenButton}

            </div>

        </div>

    `;

}


/* =========================================================
   AUTHORITY ISSUES
   ========================================================= */

function renderAuthorityIssues() {

    const issues = getIssues();


    const filter =
        document
            .getElementById("statusFilter")
            .value;


    let filtered = issues;


    if (filter !== "All") {

        filtered =
            issues.filter(
                issue =>
                    issue.status === filter
            );

    }


    const container =
        document.getElementById(
            "authorityIssues"
        );


    container.innerHTML = "";


    if (filtered.length === 0) {

        container.innerHTML =
            "<p>No issues found.</p>";

    }


    filtered
        .slice()
        .reverse()
        .forEach(issue => {

            container.innerHTML +=
                createAuthorityIssueCard(issue);

        });


    updateAuthorityStats(issues);

}


/* =========================================================
   AUTHORITY ISSUE CARD
   ========================================================= */

function createAuthorityIssueCard(issue) {

    const statusClass =
        getStatusClass(issue.status);


    const officerOptions =
        getOfficerOptions(issue);


    return `

        <div class="issue-card">

            <div class="issue-top">

                <div>

                    <div class="issue-title">

                        ${escapeHTML(issue.title)}

                    </div>

                    <div class="issue-meta">

                        Issue ID: ${issue.id}<br>

                        Citizen: ${escapeHTML(issue.citizen)}<br>

                        Category: ${issue.category}<br>

                        Area: ${issue.area}<br>

                        Location: ${escapeHTML(issue.location)}<br>

                        Created:
                        ${issue.createdAt}

                    </div>

                </div>

                <div>

                    <span class="badge ${statusClass}">

                        ${issue.status}

                    </span>

                    <span class="priority priority-${issue.priority}">

                        ${issue.priority}

                    </span>

                </div>

            </div>


            <div class="issue-description">

                ${escapeHTML(issue.description)}

            </div>


            <div class="authority-controls">

                <strong>
                    Authority Controls
                </strong>


                <label>
                    Assign Responsible Officer
                </label>

                <select id="officer-${issue.id}">

                    <option value="">
                        Select Officer
                    </option>

                    ${officerOptions}

                </select>


                <div class="action-buttons">

                    <button
                        class="action-btn primary"
                        onclick="verifyIssue('${issue.id}')"
                    >
                        Verify Issue
                    </button>


                    <button
                        class="action-btn primary"
                        onclick="assignOfficer('${issue.id}')"
                    >
                        Assign Officer
                    </button>


                    <button
                        class="action-btn warning"
                        onclick="changeStatus('${issue.id}', 'In Progress')"
                    >
                        Mark In Progress
                    </button>


                    <button
                        class="action-btn success"
                        onclick="changeStatus('${issue.id}', 'Resolved')"
                    >
                        Mark Resolved
                    </button>


                    <button
                        class="action-btn primary"
                        onclick="viewIssue('${issue.id}')"
                    >
                        View Timeline
                    </button>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   OFFICER OPTIONS
   ========================================================= */

function getOfficerOptions(issue) {

    const matching =
        officers.filter(
            officer =>
                officer.area === issue.area &&
                (
                    officer.department === issue.category ||
                    officer.department === "General"
                )
        );


    let available = matching;


    /*
       If no exact department officer exists,
       show officers from the same ward.
    */

    if (available.length === 0) {

        available =
            officers.filter(
                officer =>
                    officer.area === issue.area
            );

    }


    return available.map(officer => {

        const selected =
            issue.assignedOfficer &&
            issue.assignedOfficer.id === officer.id
                ? "selected"
                : "";

        return `

            <option
                value="${officer.id}"
                ${selected}
            >

                ${officer.name}
                -
                ${officer.department}

            </option>

        `;

    }).join("");

}


/* =========================================================
   VERIFY ISSUE
   AUTHORITY ONLY
   ========================================================= */

function verifyIssue(issueId) {

    if (!isAuthority()) {

        alert(
            "Only authorized officers can verify issues."
        );

        return;

    }


    const issues = getIssues();

    const issue =
        issues.find(
            item => item.id === issueId
        );


    if (!issue) return;


    issue.verified = true;

    issue.status =
        "Under Verification";


    addTimeline(
        issue,
        "Under Verification",
        "Authority verified the complaint."
    );


    saveIssues(issues);

    renderAuthorityIssues();

}


/* =========================================================
   ASSIGN OFFICER
   AUTHORITY ONLY
   ========================================================= */

function assignOfficer(issueId) {

    if (!isAuthority()) {

        alert(
            "Only authority can assign officers."
        );

        return;

    }


    const select =
        document.getElementById(
            "officer-" + issueId
        );


    if (!select || !select.value) {

        alert(
            "Please select an officer first."
        );

        return;

    }


    const officer =
        officers.find(
            item =>
                item.id === select.value
        );


    if (!officer) return;


    const issues = getIssues();

    const issue =
        issues.find(
            item =>
                item.id === issueId
        );


    if (!issue) return;


    issue.assignedOfficer = officer;

    issue.status = "Assigned";


    addTimeline(
        issue,
        "Assigned",
        "Authority assigned " +
        officer.name +
        " as responsible officer."
    );


    saveIssues(issues);

    renderAuthorityIssues();

}


/* =========================================================
   CHANGE STATUS
   AUTHORITY ONLY
   ========================================================= */

function changeStatus(
    issueId,
    newStatus
) {

    if (!isAuthority()) {

        alert(
            "Only authority can change issue status."
        );

        return;

    }


    const issues = getIssues();

    const issue =
        issues.find(
            item =>
                item.id === issueId
        );


    if (!issue) return;


    if (
        newStatus === "In Progress" &&
        !issue.assignedOfficer
    ) {

        alert(
            "Assign a responsible officer before starting work."
        );

        return;

    }


    issue.status = newStatus;


    let message = "";


    if (newStatus === "In Progress") {

        message =
            "Responsible officer started working on the issue.";

    }


    if (newStatus === "Resolved") {

        message =
            "Authority marked the issue as resolved.";

    }


    addTimeline(
        issue,
        newStatus,
        message
    );


    saveIssues(issues);

    renderAuthorityIssues();

}


/* =========================================================
   REOPEN REQUEST
   CITIZEN
   ========================================================= */

function requestReopen(issueId) {

    const session =
        JSON.parse(
            localStorage.getItem("civicSession")
        );


    if (
        !session ||
        session.role !== "citizen"
    ) {

        alert(
            "Only the citizen can request reopening."
        );

        return;

    }


    const issues = getIssues();

    const issue =
        issues.find(
            item =>
                item.id === issueId
        );


    if (!issue) return;


    issue.status =
        "Reopen Requested";


    addTimeline(
        issue,
        "Reopen Requested",
        "Citizen requested the issue to be reopened."
    );


    saveIssues(issues);

    renderCitizenIssues();


    alert(
        "Reopen request sent to the authority."
    );

}


/* =========================================================
   TIMELINE
   ========================================================= */

function addTimeline(
    issue,
    status,
    message
) {

    issue.updatedAt =
        new Date().toLocaleString();


    issue.timeline.push({

        status: status,

        message: message,

        actor:
            getCurrentRoleName(),

        time:
            new Date().toLocaleString()

    });

}


/* =========================================================
   VIEW ISSUE
   ========================================================= */

function viewIssue(issueId) {

    const issues = getIssues();

    const issue =
        issues.find(
            item =>
                item.id === issueId
        );


    if (!issue) return;


    let timelineHTML = "";


    issue.timeline.forEach(item => {

        timelineHTML += `

            <div class="timeline-item">

                <strong>
                    ${item.status}
                </strong>

                <div>
                    ${escapeHTML(item.message)}
                </div>

                <small>
                    ${item.actor}
                    •
                    ${item.time}
                </small>

            </div>

        `;

    });


    let officerHTML =
        "Not assigned";


    if (issue.assignedOfficer) {

        officerHTML = `

            <strong>
                ${escapeHTML(issue.assignedOfficer.name)}
            </strong>

            <br>

            ID:
            ${issue.assignedOfficer.id}

            <br>

            Department:
            ${issue.assignedOfficer.department}

            <br>

            Area:
            ${issue.assignedOfficer.area}

        `;

    }


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <h2>
            ${escapeHTML(issue.title)}
        </h2>

        <br>

        <p>
            <strong>Issue ID:</strong>
            ${issue.id}
        </p>

        <p>
            <strong>Category:</strong>
            ${issue.category}
        </p>

        <p>
            <strong>Area:</strong>
            ${issue.area}
        </p>

        <p>
            <strong>Location:</strong>
            ${escapeHTML(issue.location)}
        </p>

        <p>
            <strong>Priority:</strong>
            ${issue.priority}
        </p>

        <br>

        <h3>
            Description
        </h3>

        <p>
            ${escapeHTML(issue.description)}
        </p>

        <br>

        <h3>
            Responsible Officer
        </h3>

        <p>
            ${officerHTML}
        </p>

        <br>

        <h3>
            Issue Timeline
        </h3>

        <div class="timeline">

            ${timelineHTML}

        </div>

    `;


    document
        .getElementById("issueModal")
        .classList.remove("hidden");

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    document
        .getElementById("issueModal")
        .classList.add("hidden");

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateCitizenStats(issues) {

    document.getElementById(
        "citizenTotal"
    ).innerText = issues.length;


    document.getElementById(
        "citizenProgress"
    ).innerText =
        issues.filter(
            issue =>
                issue.status === "In Progress"
        ).length;


    document.getElementById(
        "citizenResolved"
    ).innerText =
        issues.filter(
            issue =>
                issue.status === "Resolved"
        ).length;

}


function updateAuthorityStats(issues) {

    document.getElementById(
        "authorityTotal"
    ).innerText =
        issues.length;


    document.getElementById(
        "authorityPending"
    ).innerText =
        issues.filter(
            issue =>
                issue.status === "Reported"
        ).length;


    document.getElementById(
        "authorityProgress"
    ).innerText =
        issues.filter(
            issue =>
                issue.status === "In Progress"
        ).length;


    document.getElementById(
        "authorityResolved"
    ).innerText =
        issues.filter(
            issue =>
                issue.status === "Resolved"
        ).length;

}


/* =========================================================
   AUTHORITY CHECK
   ========================================================= */

function isAuthority() {

    const session =
        JSON.parse(
            localStorage.getItem("civicSession")
        );


    return (
        session &&
        session.role === "authority"
    );

}


/* =========================================================
   CURRENT ROLE
   ========================================================= */

function getCurrentRoleName() {

    const session =
        JSON.parse(
            localStorage.getItem("civicSession")
        );


    if (!session) {

        return "System";

    }


    if (session.role === "authority") {

        return "Municipal Authority";

    }


    return "Citizen";

}


/* =========================================================
   STATUS CSS CLASS
   ========================================================= */

function getStatusClass(status) {

    switch (status) {

        case "Reported":
            return "status-reported";

        case "Under Verification":
            return "status-verification";

        case "Assigned":
            return "status-assigned";

        case "In Progress":
            return "status-progress";

        case "Resolved":
            return "status-resolved";

        case "Reopen Requested":
            return "status-reopen";

        default:
            return "";

    }

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    if (!value) return "";

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

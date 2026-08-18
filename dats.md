Design Specification
Digital Asset Tracking System — Frappe/ERPNext

Field	Detail	Field	Detail
Document ref.	SPEC-AST-001	Version	0.4 (design)
Platform	Frappe/ERPNext	Owner	PMO / IT
Author	Emmanuel Agbedejobi	Status	For review
1. Purpose and approach
This specification defines a digital replacement for the paper/PDF asset allocation process, built on Frappe/ERPNext. The goal is to capture as much of each asset’s custody history as possible — assignment, signed acknowledgement, return, and reassignment — in a system of record that is auditable and cannot be edited after the fact.
The design extends native Frappe DocTypes rather than building a custom tracker. The native Asset and Asset Movement DocTypes already model custodian, location, department and cost centre, and Asset Movement already maintains an immutable movement history. We add two things Frappe does not provide out of the box: captured signatures, and an approval-and-acknowledgement workflow with explicit state. Building on the native model keeps the system on the ERPNext upgrade path and inside its permission and reporting engine.
2. Two status dimensions
The design deliberately separates status fields that a single-status system would conflate. Custody (who is responsible for an asset) and condition (what physical state it is in) are independent axes — a laptop out for repair is still assigned to its custodian. The design tracks them separately so one never overwrites the other. Three status fields result.
Dimension	Lives on	Answers
Asset Custody Status	Asset (durable)	Who is responsible — assigned, in stores, being returned, lost from stores?
Asset Condition Flag	Asset (durable)	What state is it in — in service, under repair, lost while assigned?
Movement Approval State	Asset Movement (transient)	Where is the paperwork — drafted, approved, signed, completed?
Custody and condition are orthogonal. An asset reads as a pair: “Assigned to [employee] / Under Repair”, or “Unassigned / In Service”. A repair or a loss changes the condition flag without touching custody — the custodian stays on record because they remain responsible.
Every completed Asset Movement pushes the custody status on the Asset. The Movement is the event; the custody status is the running result of all events. Custody status updates automatically on movement completion, with a PMO override available where a manual correction is needed (see Section 7).
3. Phase zero — initial asset load
Nothing can be assigned until every asset exists as a record. Before the system goes live, the existing fleet is migrated from the current paper/PDF register into Frappe Asset records.
1.	Export the current asset register to a spreadsheet in the Frappe Asset import template format.
2.	Populate each row: asset name, serial number, asset tag, category (Laptop / Phone / Peripheral), purchase detail where known, condition, and initial custody status.
3.	Set initial custody status to “Unassigned” for assets in stores, or “Assigned” with the current custodian for assets already out, back-dated to reconcile with reality.
4.	Bulk-import via the Frappe Data Import tool.
5.	Reconcile the gaps the import surfaces: assets with no serial recorded, custodians who have left, items nobody can locate. Resolve these before the first live assignment, not during it.
This is a one-time migration. It is also the first real test of data quality — better to hit the gaps during a controlled import than at a live handover.
4. Custody statuses
Eight custody statuses. Six form the core loop; two are terminal or exceptional states. Under Repair is not here — it is a condition, not a custody state (Section 4a). Lost/Missing appears here only for the stores case; a loss while assigned is a condition flag, not a custody change (Section 4a).
Status	Group	Meaning
Unassigned	Core	In stores, available to assign.
Pending Assignment	Core	An Issue movement is in progress; not yet acknowledged.
Assigned	Core	A custodian holds it, acknowledgement signed.
Pending Return	Core	The custodian has signed release; receipt not yet confirmed.
Returned	Core	Received and inspected; transitions to Unassigned.
Pending Reassignment	Core	Outgoing custodian releasing to a named incoming custodian.
Lost / Missing (stores)	Side	Went missing while unassigned in stores — no custodian to hold. Requires a reason.
Retired / Disposed	Side	Terminal state; asset is out of service.
The core loop always returns an asset to Unassigned before it can be issued again. That invariant is what keeps the register honest — an asset cannot be issued to a second person while still showing as held by the first. Reassignment is the one permitted shortcut across the loop, and it still lands at Assigned only through two signatures.
5. The three signed movement types
All three share one approval spine and differ only in who signs and what the custody status becomes. Each maps to a native Frappe Asset Movement Purpose.
Movement	Frappe Purpose	Signers	Custody status after
Issue (first assignment)	Issue	Employee (receipt)	Assigned
Return (before A leaves)	Receipt	A (release) + PMO/IT (receipt)	Returned → Unassigned
Reassign (A → B)	Transfer and Issue	A (release) + B (receipt)	Assigned (to B)
Return and Reassign are the same double-sided shape. The only difference is whether the incoming side is a location (Stores) or a person (B). The Return is the point the paper system relied on most and enforced least: before a departing employee leaves, they must sign that the asset was returned, and the receiver must sign that it was received and inspected. Two signatures pin any damage to a custodian at a moment — the departing employee cannot later be blamed for damage that occurred after return, and cannot deny a return they signed for.
6. Movement approval workflow
One Frappe Workflow on the Asset Movement DocType, with states gated by Purpose so all three movement types share the definition. The workflow engine handles the document submission (Draft to Submitted) at the final transition automatically. The state machine is shown below; the transition tables follow.
 
6.1 Assignment path (Purpose = Issue)
State	Actor	Transition
Draft	Project Coordinator	Creates the movement, selects asset(s), custodian, location.
Pending Approval	PMO Lead	Approves, or rejects with a mandatory comment.
Pending Acknowledgement	Employee	Signs (receipt), or declines with a comment.
Completed	system	Document submitted; custody status → Assigned.
Rejected	PMO Lead / Employee	Returns to Draft; comment required.
6.2 Return and reassignment path (double-sided)
State	Actor	Transition
Draft	Project Coordinator	Creates the movement.
Pending Approval	PMO Lead	Approves, or rejects with a comment.
Pending Release	Outgoing custodian A	Signs release and records condition.
Pending Receipt	Incoming (B or PMO/IT)	Signs receipt and inspects.
Completed	system	Document submitted; custody status updated.
Rejected / Disputed	any signer	Returns to Draft; comment required; asset stays with A.
7. Automatic status update and override
On final submission of an Asset Movement, a server-side hook updates the Asset record. This is native Frappe behavior for custodian and location; the design extends it to the custody status field.
•	Native fields rewritten: custodian, location, department, cost_center.
•	Added: custody status set per the movement type (Section 5). The condition flag is set independently by the Asset Repair record (Section 8a) or a loss flag, not by movements.
•	The movement row is appended to the immutable Asset Movement history.
•	Signature images are stamped into the submitted, immutable document.
The PMO Lead may override the custody status manually — for example, to flag an asset Lost/Missing without a movement, or to correct a migration error. Every override requires a reason, captured in a mandatory field and logged. Overrides are the exception; the normal path is automatic.
8. Data model
The full data model is listed below in three parts: the native Asset fields the design relies on, the custom fields added to the Asset (including the hardware specification fields the paper register held but native Frappe does not), and the custom fields added to the Asset Movement.
8.1 Native Asset fields used
These ship with ERPNext and are used as-is. Note that native Frappe has no serial number, RAM or specification field on the Asset — those are added in 8.2. Note also that the native status field is accounting-driven (Draft, Submitted, Scrapped, In Maintenance, and so on); the design keeps custody status as a separate custom field to avoid colliding with it.
Native field	Type	Use here
asset_name	Data	Descriptive name, e.g. “Dell Latitude 5440 — Kiitan”.
item_code	Link (Item)	The fixed-asset Item this asset instances.
asset_category	Link	Laptop / Phone / Peripheral category (accounting side).
custodian	Link (Employee)	Current holder. Rewritten by each movement.
location	Link (Location)	Physical location, e.g. Stores, Head Office.
department	Link	Cost/reporting department.
cost_center	Link	Accounting cost centre.
company	Link	Owning company.
purchase_date	Date	Acquisition date.
purchase_amount	Currency	Acquisition cost.
supplier	Link	Vendor the asset was bought from.
status	Select	Native accounting status — not used for custody.
image	Attach Image	Photo of the asset.
8.2 Custom Asset fields — identification and specification
Added to the Asset DocType. This is where the serial number and hardware specification live — the detail the paper register carried.
Custom field	Type	Purpose
custom_serial_number	Data (unique)	Manufacturer serial number. Unique constraint prevents duplicate entry.
custom_asset_tag	Data (unique)	Internal asset tag / barcode label.
custom_asset_class	Select	Laptop / Phone / Peripheral. Drives whether double-sided applies.
custom_make	Data	Manufacturer, e.g. Dell, Apple, HP.
custom_model	Data	Model, e.g. Latitude 5440, MacBook Air M3.
custom_processor	Data	CPU, e.g. Intel Core i7-1355U, Apple M3.
custom_ram	Select	Memory, e.g. 8GB / 16GB / 32GB.
custom_storage	Data	Storage, e.g. 512GB SSD, 1TB NVMe.
custom_operating_system	Data	OS and version, e.g. Windows 11 Pro, macOS 15.
custom_imei	Data	IMEI for phones (blank for laptops/peripherals).
custom_condition_grade	Select	New / Good / Fair / Poor at last inspection.
custom_accessories	Small Text	Bundled items moved and signed for with the laptop: charger, bag, mouse, dock. Not tracked as separate assets.
custom_warranty_expiry	Date	Warranty end date.
8.3 Custom Asset fields — custody and status
Also on the Asset DocType. These carry the custody state that the movements drive.
Custom field	Type	Purpose
custom_custody_status	Select	The nine statuses in Section 4.
custom_condition_on_issue	Small Text	Baseline condition captured at handover, for damage comparison.
custom_current_signed_movement	Link	Points to the live custody Asset Movement.
custom_status_override_reason	Small Text	Mandatory when status is set manually (Section 7).
8.4 Custom Asset Movement fields
Added to the Asset Movement DocType — the acknowledgement and signature layer.
Custom field	Type	Purpose
custom_release_signature	Signature	Outgoing custodian A; return and reassignment.
custom_receipt_signature	Signature	Incoming custodian or receiver; all movements.
custom_release_condition	Small Text	Condition recorded by A at release.
custom_receipt_condition	Small Text	Condition recorded by the receiver at inspection.
custom_acknowledgement_datetime	Datetime	Set when the final signature is captured.
custom_release_bypass	Check	Set when the PMO Lead signs release on behalf of a departed custodian.
custom_bypass_reason	Small Text	Mandatory when release bypass is used (Section 11).
custom_reject_comment	Small Text	Mandatory on any rejection.
9. Signature capture — in-person and remote
Both modes use the same native Signature field and produce the same stamped image on the same document. There is no separate build; the document is simply reached two ways.
Mode	Flow
In-person	The Signature field renders a canvas. The employee draws on the Coordinator’s screen at handover.
Remote	A Workflow Action email shares the document to the employee’s ERP portal. They open it, review, and sign on their own device.

10. Design decisions confirmed
Decision	Chosen
Reassignment acknowledgement	Double-sided — A releases, then B accepts.
Approval gate	PMO Lead approves before the employee acknowledges.
Signature capture	Both — drawn signature in person, portal acknowledgement if remote.
Return movement signatures	Two — A releases and the receiver confirms.
Initial asset load	Bulk import from an exported spreadsheet.
Custody status update	Automatic on movement completion; PMO override with a reason.
Custody vs condition	Separate axes — custody unchanged by repair or assigned loss.
Under Repair	Condition flag via native Asset Repair; no signatures, no custody change.
Lost/Missing	Condition flag if lost while assigned; custody status only if lost from stores.
Faulty component	Predefined dropdown for failure-pattern reporting.
Retired/Disposed	Terminal custody status; only reachable via the return path.
Movements per person	One movement per person — assets are never issued to multiple people in one movement.
Post-release rejection	Asset returns to A; its condition decides the next step (repair or unassign). B is issued a different device.
Stuck acknowledgement	Reminder after 3 days; PMO may then force-acknowledge with a note.
Asset lock	An asset with an open movement is locked from new movements.
Lost recovery	A found asset has a defined path back to In Service / Unassigned.
Permissions	View-all; edit-own; delete admin-only; most actions admin-prompted.
11. Departed-custodian release
The double-sided Return and Reassign paths both require the outgoing custodian A to sign release. At offboarding — when reassignment and return are most common — A may have already left and be uncontactable, which would deadlock the flow.
The bypass: the PMO Lead signs the release on A’s behalf, with a mandatory reason such as “custodian separated, released by line manager”. The PMO Lead is the accountable party for the custody chain and the Project Coordinator’s line manager, so release authority sits with them rather than being split to another role. This keeps the audit trail honest — it records who actually released the asset and why the normal signer did not — rather than leaving the record stuck or letting the step be skipped silently. It mirrors the offboarding SOP, where the emergency and departed-employee paths already vest recovery authority in the PMO Lead.
Rule	Detail
Who may bypass	The PMO Lead only. No other role can sign release on a custodian’s behalf.
When	The outgoing custodian has separated or is uncontactable and cannot sign release.
Required	The custom_release_bypass flag is set and custom_bypass_reason is mandatory.
Effect on record	The release is recorded as a bypass, visibly distinct from a custodian signature — it does not fake A’s signature.
The bypass is the release side only. The incoming side — B on a reassignment, or the receiver on a return — still signs normally. A departed custodian removes one signature from the flow, not both.
12. Edge cases and operating rules
These rules resolve the conditions a paper system left undefined. Each is a hard rule for the build, not a guideline.
12.1 One movement per person
An Asset Movement carries exactly one asset issued to exactly one person. Assets are never provisioned to multiple people in a single movement, even for an onboarding cohort. The signature is personal; a shared movement would dilute the acknowledgement. Fifteen new hires means fifteen movements. Enforce a single-asset, single-custodian constraint on issue-type movements.
12.2 Post-release rejection returns the asset to A
In a reassignment, if B rejects after A has already signed release, the asset returns to A — not to stores and not to limbo. A’s custody is restored, and the asset’s condition then decides the next step:
•	If the device is faulty (the reason B rejected), it enters the repair process — condition flag set to Under Repair.
•	If the device is sound but B simply cannot take it, it is set Unassigned and returned to stores through a normal return.
Consequence: B still needs a device. A separate, new Issue movement assigns a different asset to B. The failed reassignment and the replacement issue are two distinct records — the failure is not erased, it is closed and a new movement opened.
12.3 Stuck acknowledgement — reminder then force-acknowledge
A movement can sit in Pending Acknowledgement if the employee never signs, leaving custody status short of Assigned while the device is physically in use.
1.	A reminder is sent to the employee 3 days after the movement enters Pending Acknowledgement.
2.	If still unacknowledged after the reminder, the PMO Lead may force-acknowledge with a mandatory note (for example, “employee in possession, portal not actioned”).
3.	A force-acknowledgement is logged and distinguishable from an employee signature in the record — it does not fake a signature, it records an override.
12.4 Asset lock during a live movement
An asset with an open, unsubmitted movement is locked: no second movement and no repair can be raised against it until the current one completes or is cancelled. This prevents two workflows racing and leaving custody undefined. Enforce with a validation on movement and repair creation that checks for an existing open movement on the asset.
12.5 Lost recovery
A found asset has a defined path back, depending on how it was lost:
•	Lost while assigned (condition flag): the flag returns to In Service. Custody was never lost — it stayed Assigned throughout — so nothing else changes.
•	Lost from stores (custody status): the status returns to Unassigned and the condition flag to In Service.
Both transitions require a reason (“recovered on [date], found in [location]”) and are logged.
12.6 Retire only via return
An asset cannot be set Retired/Disposed while it is Assigned. It must first go through the return path to Unassigned, then be retired. This prevents disposing of an asset the record shows an employee is holding. Enforce by blocking the retire transition unless custody status is Unassigned.
12.7 Asset scope and the charger bundle
The tracked asset is the laptop. The charger is not a standalone asset with its own movement — it is assigned with the laptop, as part of the bundle, and recorded in the laptop’s accessory list (custom_accessories). One movement covers the laptop and everything bundled with it; the employee signs once for the package. The charger therefore has no independent Issue, Return or Reassign cycle — it moves when the laptop moves.
This closes the single-sided question: there is no single-sided movement in the system. Every movement is a laptop movement, and laptops are double-sided. Nothing moves on its own signature.
The laptop carries a unique serial number, so the uniqueness constraint on custom_serial_number holds without exception. Unserialised low-value items — charger, bag, mouse — are tracked as accessory lines against the laptop, not as separate serialised assets. Phase Zero still includes a data-cleaning pass to catch any blank or malformed laptop serials in the legacy register before the constraint is enforced.
13. Permissions
The workflow is only as trustworthy as the permission model beneath it. Permissions follow one principle: see broadly, act narrowly, and let sensitive actions be admin-prompted and managed.
Action	Who	Rule
View assignments	All staff	Anyone can see who holds what. Transparency is deliberate — it discourages quiet swaps.
Edit a record	Own assignment only	A user can act on their own assignment (acknowledge, sign) but not on others’. Actions are gated to what the role permits at that state.
Create / manage movements	Project Coordinator (admin-prompted)	Movements, repairs and status changes are initiated and managed by the administrator role, not self-served by staff.
Approve	PMO Lead	Approval and force-acknowledge are the PMO Lead’s alone.
Delete	Admin only	Deletion of any record — movement, repair, asset — is restricted to the administrator. No other role can delete.
Edit submitted records	Nobody	A submitted movement or repair is immutable. Corrections are made by a new, reversing record, never by editing history.
The last row is the audit anchor: if any role can quietly edit a submitted record, the system is not audit-grade regardless of how complete the workflow is. Submitted documents are frozen; the only way to change the story is to add to it.
14. Build sequence
1.	Add the custom fields (Section 8) to Asset and Asset Movement.
2.	Build and dry-run the Phase Zero import on a copy of the register.
3.	Configure the Workflow, states and role-gated transitions (Section 6).
4.	Write the server-side hook for automatic custody status update and the override path (Section 7).
5.	Configure the Workflow Action emails for remote signing (Section 9).
6.	Add the custom Asset Repair fields and the condition-flag hook (Section 8a).
7.	Implement the operating rules (Section 12): single-asset issue constraint, asset lock, acknowledgement reminder and force-acknowledge, lost-recovery and retire-via-return guards.
8.	Configure the permission model (Section 13) and verify submitted records are immutable for every non-admin role.
9.	Test each of the three movement types end to end, including a rejection and a departed-custodian bypass.
10.	Run the live import and reconcile.
11.	Build the reports: custody status and condition across the fleet, plus a faulty-component failure-pattern report.

Appendix A — Frappe workflow configuration
This appendix is the literal configuration for the Asset Movement workflow, in the structure of Frappe’s Workflow DocType. It has two grids: Workflow States (A.1) and Workflow Transitions (A.2), followed by the field-level detail the transitions rely on (A.3) and the workflow-scoped settings (A.4). One workflow governs all three movement types; the Purpose field gates which transitions are available.
Convention: the workflow is named “Asset Movement Custody” and attached to the Asset Movement DocType. Document State maps to Frappe’s docstatus — 0 Draft, 1 Submitted, 2 Cancelled. “Allow Edit” names the single role that may act on a document while it sits in that state.
A.1 Workflow States
State	Doc status	Allow Edit (role)	Custody effect on entry
Draft	0 Draft	Project Coordinator	Pending Assignment / Reassignment (on Asset).
Pending Approval	0 Draft	PMO Lead	Unchanged — awaiting gate.
Pending Acknowledgement	0 Draft	Employee	Unchanged — Issue only.
Pending Release	0 Draft	PMO Lead	Unchanged — Return / Reassign.
Pending Receipt	0 Draft	PMO Lead	Unchanged — Return / Reassign.
Completed	1 Submitted	—	Custody status pushed to Asset (Section 5).
Rejected	0 Draft	Project Coordinator	Reset to prior; asset stays with A.
Pending Release and Pending Receipt do not apply to an Issue; Pending Acknowledgement does not apply to a Return or Reassign. The transitions in A.2 enforce this through the Condition column, so unused states are simply never reached for that Purpose.
A.2 Workflow Transitions
Each row is one transition: from a state, an action button appears to the named role, moving the document to the next state when the condition holds. Conditions are Frappe server-side expressions on the document (doc).
Issue (first assignment) — Purpose = “Issue”
State	Action	Next state	Allowed role	Condition (doc)
Draft	Submit for approval	Pending Approval	Project Coordinator	doc.purpose == "Issue"
Pending Approval	Approve	Pending Acknowledgement	PMO Lead	doc.purpose == "Issue"
Pending Approval	Reject	Rejected	PMO Lead	doc.custom_reject_comment
Pending Acknowledgement	Acknowledge & sign	Completed	Employee	doc.custom_receipt_signature
Pending Acknowledgement	Force-acknowledge	Completed	PMO Lead	doc.custom_ack_override_note
Pending Acknowledgement	Decline	Rejected	Employee	doc.custom_reject_comment
Rejected	Return to draft	Draft	Project Coordinator	—
Return (before A leaves) — Purpose = “Receipt”
State	Action	Next state	Allowed role	Condition (doc)
Draft	Submit for approval	Pending Approval	Project Coordinator	doc.purpose == "Receipt"
Pending Approval	Approve	Pending Release	PMO Lead	doc.purpose == "Receipt"
Pending Approval	Reject	Rejected	PMO Lead	doc.custom_reject_comment
Pending Release	Custodian signs release	Pending Receipt	Employee	doc.custom_release_signature
Pending Release	PMO bypass release	Pending Receipt	PMO Lead	doc.custom_release_bypass and doc.custom_bypass_reason
Pending Receipt	Receiver confirms	Completed	PMO Lead	doc.custom_receipt_signature
Pending Receipt	Dispute	Rejected	PMO Lead	doc.custom_reject_comment
Rejected	Return to draft	Draft	Project Coordinator	—
Reassign (A → B) — Purpose = “Transfer and Issue”
State	Action	Next state	Allowed role	Condition (doc)
Draft	Submit for approval	Pending Approval	Project Coordinator	doc.purpose == "Transfer and Issue"
Pending Approval	Approve	Pending Release	PMO Lead	doc.purpose == "Transfer and Issue"
Pending Approval	Reject	Rejected	PMO Lead	doc.custom_reject_comment
Pending Release	Custodian A signs release	Pending Receipt	Employee	doc.custom_release_signature
Pending Release	PMO bypass release	Pending Receipt	PMO Lead	doc.custom_release_bypass and doc.custom_bypass_reason
Pending Receipt	Custodian B accepts	Completed	Employee	doc.custom_receipt_signature
Pending Receipt	Reject (to A)	Rejected	Employee	doc.custom_reject_comment
Rejected	Return to draft	Draft	Project Coordinator	—
On a Reassign rejection at Pending Receipt, the workflow returns to Rejected and the asset stays with A (Section 12.2). B’s replacement device is a separate new Issue, not a re-run of this movement.
A.3 Fields the conditions depend on
The transition conditions reference these fields. The signature fields must be non-empty for the transition to fire, which is how Frappe enforces “no progress without a signature”. One field below is additional to Section 8 and should be added:
Field	Type	Note
custom_receipt_signature	Signature	Gates acknowledgement / receipt. From Section 8.4.
custom_release_signature	Signature	Gates release. From Section 8.4.
custom_release_bypass	Check	Enables the PMO bypass transition. From Section 8.4.
custom_bypass_reason	Small Text	Mandatory with bypass. From Section 8.4.
custom_reject_comment	Small Text	Mandatory on any reject / decline / dispute. From Section 8.4.
custom_ack_override_note	Small Text	NEW — mandatory note on a PMO force-acknowledge (Section 12.3). Add to Asset Movement.
A.4 Workflow-scoped settings and hooks
Setting	Value / behaviour
Document DocType	Asset Movement.
Is Active	Yes.
Send Email Alert	On — drives the remote-signing Workflow Action emails (Section 9).
Override status	Custody status field is written by the on-submit hook, not by the workflow state directly (Section 7).
Single-asset guard	validate() on Asset Movement blocks more than one asset row on Issue-type movements (Section 12.1).
Asset lock	validate() on Asset Movement and Asset Repair blocks creation where the asset has an open movement (Section 12.4).
3-day reminder	Scheduled job flags documents in Pending Acknowledgement older than 3 days and emails the employee (Section 12.3).
Immutability	On submit (docstatus 1) the document is read-only for all roles; corrections are new reversing movements (Section 13).
The workflow moves the document and gates it by role and signature; the custody status, the locks and the reminders are enforced in server-side code the workflow triggers. Keeping status out of the raw workflow state is deliberate — it lets condition and custody stay on separate axes (Section 2) without the workflow engine fighting them.

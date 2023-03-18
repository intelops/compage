---
sidebar_position: 5
---

# Telemetry

By default, the Compage collects some anonymous usage data. There are two types of data we collect:

- **Usage**: features usage, we use this data to understand which providers are being used and how much, which helps
  guide our roadmap and development efforts.
- **Errors**: stack traces sent whenever a panic occurs in the core component. Having this data allows us to be notified
  when there is a bug that needs to be prioritized.

### We will never:

- Identify or track users.
- Collect personal information such as IP addresses, email addresses, or website URLs.
- Store data about your cloud resources or credentials .

## Why collect telemetry data?

We collect telemetry data for only two reasons:

- In order to create a better product, we need reliable quantitative information. The data we collect helps us fix bugs,
  evaluate the success of features, and better understand our users' needs.

- We also need to prove that people are actually using Compage.

## How to disable data collection

Data collection can be disabled at any time by setting a key in values.yaml, then re-installing the Compage instance.

```yaml
core:
    telemetry: false
```


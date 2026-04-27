# 14 — Tax Incentive and ESG Funding Source Map

> For documentation and planning purposes only.  
> All incentive estimates require confirmation by a qualified tax professional.  
> ESG metrics require third-party verification for certification submissions.

## Tax Incentive Programs (Built-in Catalog)

### Federal Programs

| Program | Category | Typical Benefit | Key Condition |
|---|---|---|---|
| IRS 179D (Energy Efficient Commercial) | `energy_efficiency_deduction` | $0.50–$5.00/sq ft deduction | Post-2022 design standards; third-party certification |
| IRS 45L (New Energy Efficient Home) | `energy_efficiency_deduction` | $2,500–$5,000 per unit | ENERGY STAR v3.1+ or DOE Zero Energy Ready |
| DOE Better Buildings Initiative | `federal_grant` | Technical assistance + potential funding | Commitment to 20% energy reduction over 10 years |
| New Markets Tax Credit (NMTC) | `federal_tax_credit` | ~20–25% effective borrowing cost reduction | Qualified low-income census tract; CDFI partner |

### Georgia State Programs

| Program | Category | Typical Benefit | Key Condition |
|---|---|---|---|
| GA Property Tax Exemption (Energy Improvements) | `property_tax_exemption` | Exempts value of qualifying improvements from property tax | Qualifying HVAC, solar, insulation |
| GA State Energy Loan | `state_loan` | Below-market rate loans | State Energy Office eligibility |

### Utility / Green Finance

| Program | Category | Typical Benefit | Key Condition |
|---|---|---|---|
| GE (Georgia Power) Energy Rebates | `utility_rebate` | Rebates for qualifying equipment | Utility service territory; pre-approval required |
| C-PACE (Georgia) | `green_bank_financing` | Long-term low-cost financing | Participating county; lender consent; energy audit |

---

## Incentive Stacking Strategy

Programs that may stack for a qualifying Clay Terrace project:

```
179D  +  45L  +  C-PACE  +  GA Property Tax Exemption  +  Utility Rebates
  ↓         ↓       ↓                ↓                           ↓
Deduction  Credit  PACE Lien   Tax Assessment Relief       Cash Rebate
```

> **Critical rule**: Incentive proceeds (grants, credits, rebates) are **never counted as committed capital** for PoF or lender submission until funds are actually received and verified.

---

## ESG Metric Categories and Weights

| Category | Weight | Certification Examples |
|---|---|---|
| Energy | 25% | ENERGY STAR, ASHRAE 90.1, LED retrofit |
| Emissions | 20% | Carbon baseline, reduction target, third-party audit |
| Water | 10% | Low-flow fixtures, stormwater management |
| Resilience | 10% | Backup power, flood zone rating, hardened envelope |
| Indoor Air Quality | 10% | MERV 13+, CO₂ monitoring, VOC materials |
| Community Impact | 10% | Jobs created, local hiring, affordable unit commitment |
| Workforce | 5% | Living wage, apprenticeship, diversity programs |
| Compliance | 5% | ADA, OSHA, environmental permits current |
| Documentation | 5% | All above supported by evidence references |

### Score Thresholds

| Status | Threshold |
|---|---|
| `certification_ready` | ≥ 80 weighted score, no missing evidence |
| `evidence_complete` | ≥ 50 weighted score, no missing evidence |
| `evidence_partial` | Score > 0, some missing evidence |
| `evidence_missing` | Evidence missing with low score |
| `not_assessed` | Score = 0 |

### Estimated vs Verified Metrics

| Metric Type | Weight Applied |
|---|---|
| Verified + evidence attached | 100% |
| Estimate flag set | 40% |
| No evidence | 0% |

> Carbon reduction and water reduction figures are estimates until third-party certification is completed.

package cosign

import (
	"context"
	"github.com/fatih/color"
	"github.com/google/go-containerregistry/pkg/name"
	artifactUtils "github.com/intelops/compage/cmd/artifacts/utils"
	"github.com/sigstore/cosign/v2/cmd/cosign/cli/fulcio"
	"github.com/sigstore/cosign/v2/cmd/cosign/cli/options"
	"github.com/sigstore/cosign/v2/cmd/cosign/cli/rekor"
	"github.com/sigstore/cosign/v2/cmd/cosign/cli/verify"
	"github.com/sigstore/cosign/v2/pkg/cosign"
	sig "github.com/sigstore/cosign/v2/pkg/signature"
	"github.com/sigstore/sigstore/pkg/cryptoutils"
	log "github.com/sirupsen/logrus"
)

func VerifyArtifact(ctx context.Context, key string) error {
	artifactURL := ctx.Value(artifactUtils.ContextKeyArtifactURL).(string)
	ref, err := name.ParseReference(artifactURL)
	if err != nil {
		log.Errorf("parsing reference: %v", err)
		return err
	}
	chopts := &cosign.CheckOpts{
		ClaimVerifier: cosign.SimpleClaimVerifier,
	}
	chopts.RekorClient, err = rekor.NewClient(options.DefaultRekorURL)
	if err != nil {
		log.Errorf("creating Rekor client: %v", err)
		return err
	}
	chopts.RootCerts, err = fulcio.GetRoots()
	if err != nil {
		log.Errorf("getting Fulcio root certs: %v", err)
		return err
	}
	ro := options.RegistryOptions{}
	chopts.RegistryClientOpts, err = ro.ClientOpts(ctx)
	if err != nil {
		log.Errorf("getting registry client options: %v", err)
		return err
	}
	chopts.IntermediateCerts, err = fulcio.GetIntermediates()
	if err != nil {
		log.Errorf("unable to get Fulcio intermediate certs: %s", err)
		return err
	}
	// Check if PubKey is supplied
	if key != "" {
		pub, err := sig.LoadPublicKey(ctx, key)
		if err != nil {
			log.Errorf("Error loading Pub Key: %v", err)
			return err
		}
		chopts.SigVerifier = pub
	}
	fulcioVerified := chopts.SigVerifier == nil
	chopts.RekorPubKeys, err = cosign.GetRekorPubs(ctx)
	if err != nil {
		log.Errorf("unable to get Rekor public keys: %s", err)
		return err
	}
	chopts.CTLogPubKeys, err = cosign.GetCTLogPubs(ctx)
	if err != nil {
		log.Errorf("unable to get CTLog public keys: %s", err)
		return err
	}
	sigs, bundleVerified, err := cosign.VerifyImageSignatures(context.Background(), ref, chopts)
	if err != nil {
		log.Errorf("verifying image signatures: %v", err)
		return err
	}

	if bundleVerified {
		verify.PrintVerificationHeader(ctx, ref.String(), chopts, bundleVerified, fulcioVerified)
		for _, signature := range sigs {
			if cert, err := signature.Cert(); err == nil && cert != nil {
				ce := cosign.CertExtensions{Cert: cert}
				sub := ""
				if sans := cryptoutils.GetSubjectAlternateNames(cert); len(sans) > 0 {
					sub = sans[0]
				}
				color.Green("Certificate subject: %s", sub)
				if issuerURL := ce.GetIssuer(); issuerURL != "" {
					color.Green("Certificate issuer URL: %s", issuerURL)
				}
				if githubWorkflowTrigger := ce.GetCertExtensionGithubWorkflowTrigger(); githubWorkflowTrigger != "" {
					color.Green("GitHub Workflow Trigger: %s", githubWorkflowTrigger)
				}
				if githubWorkflowSha := ce.GetExtensionGithubWorkflowSha(); githubWorkflowSha != "" {
					color.Green("GitHub Workflow SHA: %s", githubWorkflowSha)
				}
				if githubWorkflowName := ce.GetCertExtensionGithubWorkflowName(); githubWorkflowName != "" {
					color.Green("GitHub Workflow Name: %s", githubWorkflowName)
				}
				if githubWorkflowRepository := ce.GetCertExtensionGithubWorkflowRepository(); githubWorkflowRepository != "" {
					color.Green("GitHub Workflow Repository: %s", githubWorkflowRepository)
				}
				if githubWorkflowRef := ce.GetCertExtensionGithubWorkflowRef(); githubWorkflowRef != "" {
					color.Green("GitHub Workflow Ref: %s", githubWorkflowRef)
				}
			}
		}
	}
	return nil
}

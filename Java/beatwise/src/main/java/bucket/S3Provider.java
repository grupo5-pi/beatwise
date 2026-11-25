package bucket;

import io.github.cdimascio.dotenv.Dotenv;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

public class S3Provider {

    private final AwsCredentialsProvider credentials;

    public S3Provider() {
        Dotenv env = Dotenv.load();
        AwsSessionCredentials creds = AwsSessionCredentials.create(
                env.get("AWS_ACCESS_KEY_ID"),
                env.get("AWS_SECRET_ACCESS_KEY"),
                env.get("AWS_SESSION_TOKEN"));
        this.credentials = StaticCredentialsProvider.create(creds);
    }

    public S3Client getS3Client() {
        return S3Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(credentials)
                .build();
    }
}
